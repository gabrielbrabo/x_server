const History = require("../models/History");
const Student = require("../models/Student");
const Class = require("../models/Class");
const School = require("../models/School");
const ReportCard = require("../models/Report_card");
const IStQuarter = require("../models/I_stQuarter");
const IINdQuarter = require("../models/II_ndQuarter");
const IIIrdQuarter = require("../models/III_rdQuarter");
const IVThQuarter = require("../models/IV_thQuarter");

class HistoryController {
    // Finaliza o ano letivo criando histórico de todos os alunos da escola
    async createHistoryGrade(req, res) {
        try {
            const { idSchool, year } = req.body;

            // Buscar a escola
            const school = await School.findById(idSchool)
                .populate("id_student")
                .lean();

            if (!school) {
                return res.status(404).json({ message: "Escola não encontrada" });
            }

            // Buscar todos os bimestres da escola para o ano solicitado
            const [iStQuarter, iiNdQuarter, iiiRdQuarter, ivThQuarter] = await Promise.all([
                IStQuarter.find({ id_school: idSchool, year: year.toString() }),
                IINdQuarter.find({ id_school: idSchool, year: year.toString() }),
                IIIrdQuarter.find({ id_school: idSchool, year: year.toString() }),
                IVThQuarter.find({ id_school: idSchool, year: year.toString() }),
            ]);

            // Função auxiliar para converter nota em número com fallback
            const parseGrade = (value) => {
                const num = parseFloat(value);
                return isNaN(num) ? 0 : num;
            };

            // Calcular totalGrade (soma de todos os totalGrade dos bimestres)
            const totalGrade =
                iStQuarter.reduce((acc, q) => acc + parseGrade(q.totalGrade), 0) +
                iiNdQuarter.reduce((acc, q) => acc + parseGrade(q.totalGrade), 0) +
                iiiRdQuarter.reduce((acc, q) => acc + parseGrade(q.totalGrade), 0) +
                ivThQuarter.reduce((acc, q) => acc + parseGrade(q.totalGrade), 0);

            // Calcular averageGrade (somando todas as médias dos bimestres)
            const averageGrade =
                iStQuarter.reduce((acc, q) => acc + parseGrade(q.averageGrade), 0) +
                iiNdQuarter.reduce((acc, q) => acc + parseGrade(q.averageGrade), 0) +
                iiiRdQuarter.reduce((acc, q) => acc + parseGrade(q.averageGrade), 0) +
                ivThQuarter.reduce((acc, q) => acc + parseGrade(q.averageGrade), 0);

            // Buscar todas as turmas (para capturar professor regente quando aplicável)
            const classes = await Class.find({ id_school: idSchool })
                .populate("classRegentTeacher")
                .lean();

            const historiesToSave = [];

            // Para cada aluno cadastrado na escola (inclusive sem turma)
            for (const student of school.id_student) {
                // Encontrar a turma do aluno, se existir
                const classData = classes.find(cls =>
                    cls.id_student?.some(s => s.toString() === student._id.toString())
                );

                // Buscar todos os reportCards do ano para o aluno
                const reportCards = await ReportCard.find({
                    id_student: student._id,
                    year: year.toString()
                });

                const reportCardIds = reportCards.map(rc => rc._id);

                const history = {
                    nameStudent: student.name,
                    nameTeacher: classData?.classRegentTeacher?.[0]?.name || "",
                    nameSchool: school.name,
                    year: year.toString(),
                    totalGrade: totalGrade,
                    averageGrade: averageGrade,
                    reportCard: reportCardIds,
                    id_student: student._id,
                    idTeacher: classData?.classRegentTeacher?.[0]?._id || null,
                    idClass: classData?._id || null
                };

                historiesToSave.push(history);
            }

            // Salvar todos os históricos
            //const savedHistories = await History.insertMany(historiesToSave);

            return res.status(201).json({
                message: "Históricos de todos os alunos da escola criados com sucesso!",
                total: historiesToSave.length,
                historiesToSave,
            });

        } catch (error) {
            console.error("Erro ao finalizar o ano letivo:", error);
            return res.status(500).json({
                message: "Erro ao criar históricos dos alunos",
                error: error.message,
            });
        }
    }
}

module.exports = new HistoryController();
