const Employee = require("../models/Employee")
const Student = require("../models/Student")
const Cards = require("../models/Report_card")
const Matter = require("../models/Matter")
const NumericalGrade = require("../models/NumericalGrade")
const Concept = require("../models/Grade")
const Attendance = require("../models/Attendance")

const I_stQuarter = require("../models/I_stQuarter")
const II_ndQuarter = require("../models/II_ndQuarter")
const III_rdQuarter = require("../models/III_rdQuarter")
const IV_thQuarter = require("../models/IV_thQuarter")
const Class = require("../models/Class")

class RepoCardController {

    async create(req, res) {
        const { year, bimonthly, totalGrade, averageGrade, studentGrade, idBimonthly, id_matter, id_employee, id_student } = req.body;

        // validations
        if (!year) {
            return res.status(422).json({ msg: "O Ano é obrigatório!" });
        }

        if (!id_matter) {
            return res.status(422).json({ msg: "A serie da turma é obrigatório!" });
        }

        if (!id_employee) {
            return res.status(422).json({ msg: "O nivel da turma é obrigatório!" });
        }

        if (!id_student) {
            return res.status(422).json({ msg: "o turno é obrigatória!" });
        }

        // check if class exists
        const student = await Student.findOne({ _id: id_student });

        const card = await Cards.find({ _id: student.id_reporter_card });

        if (card) {

            const Res = card.map(result => {
                if (result.year == year) {
                    if (result.bimonthly == bimonthly) {
                        if (result.id_matter == id_matter) {
                            return result
                        }
                    }
                }
            }).filter((fill) => {
                return fill
            })

            if (Res.length > 0) {
                return res.status(422).json({ Res, msg: "Esse aluno ja tem um boletinho cadastrado!" });
            }
            console.log("card", Res)
        }

        // create user
        const newreportCards = new Cards({
            year: year,
            bimonthly: bimonthly.toUpperCase(),
            totalGrade: totalGrade,
            averageGrade: averageGrade,
            studentGrade: studentGrade,
            idBimonthly: idBimonthly,
            id_matter: id_matter,
            id_employee: id_employee,
            id_student: id_student
        })

        try {

            const reportCards = await newreportCards.save()

            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_reporter_card: reportCards._id
                }
            })

            await Employee.updateOne({
                _id: id_employee
            }, {
                $push: {
                    id_reporter_card: reportCards._id
                }
            })

            await Matter.updateOne({
                _id: id_matter
            }, {
                $push: {
                    id_reporter_card: reportCards._id
                }
            })

            res.status(200).json({
                msg: 'Turma cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async allTheBulletinsGrades(req, res) {
        const {
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body.idClass;

        console.log("dados dos boletins", req.body)

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('physicalEducationTeacher');


        let bimonthly = null;

        if (id_iStQuarter) {
            bimonthly = await I_stQuarter.findOne({ _id: id_iStQuarter });
        }

        if (id_iiNdQuarter) {
            bimonthly = await II_ndQuarter.findOne({ _id: id_iiNdQuarter });
        }

        if (id_iiiRdQuarter) {
            bimonthly = await III_rdQuarter.findOne({ _id: id_iiiRdQuarter });
        }

        if (id_ivThQuarter) {
            bimonthly = await IV_thQuarter.findOne({ _id: id_ivThQuarter });
        }

        // Se bimonthly tiver dados de data, monta o intervalo
        let attendance = [];
        if (bimonthly) {
            const startDate = new Date(
                Number(bimonthly.startyear),
                Number(bimonthly.startmonth) - 1, // mês começa em 0 no JS
                Number(bimonthly.startday)
            );
            const endDate = new Date(
                Number(bimonthly.endyear),
                Number(bimonthly.endmonth) - 1, // mês começa em 0 no JS
                Number(bimonthly.endday),
                23, 59, 59 // inclui até o final do dia
            );
            console.log("bimonthly", bimonthly)
            console.log("startDate", startDate, "endDate", endDate)
            attendance = await Attendance.find({
                id_class: idClass, // Filtra pela turma
                date: {
                    $gte: startDate, // Maior ou igual a data de início
                    $lte: endDate    // Menor ou igual a data de fim
                }
            }).populate('id_teacher');
        }

        //const classRegentTeacher = cla$$

        // 🔎 Filtrando os registros onde o professor NÃO é de Educação Física
        /* const filteredAttendance = attendance.filter(item => {
             const teacherId = item.id_teacher._id.toString();
             return !physicalEducationTeachers.includes(teacherId);
         });*/


        //console.log("filteredAttendance", filteredAttendance)
        //console.log("classRegentTeacher", classRegentTeacher)

        const filter = {};

        // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

        // Para cada aluno, busca suas notas e soma por matéria
        const boletins = await Promise.all(
            cla$$.id_student.map(async (aluno) => {
                const filter = {
                    id_student: aluno._id,
                    id_class: idClass,
                };

                // Filtro por bimestre
                if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
                if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
                if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
                if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

                const grades = await NumericalGrade.find(filter).populate('id_matter');

                const totalPorMateria = {};

                grades.forEach((g) => {
                    const nomeMateria = g.id_matter?.name || 'Matéria não definida';
                    const nota = parseFloat(String(g.studentGrade).replace(',', '.')) || 0;

                    if (!totalPorMateria[nomeMateria]) {
                        totalPorMateria[nomeMateria] = 0;
                    }

                    totalPorMateria[nomeMateria] += nota;
                });

                // 🔥 Frequência desse aluno no período filtrado
                const freqAluno = attendance.filter(
                    (a) => String(a.id_student) === String(aluno._id)
                );

                const totalAulas = freqAluno.length;
                const totalPresencas = freqAluno.filter((a) => a.status === "P").length;
                const totalFaltas = freqAluno.filter((a) => a.status === "F").length;
                const totalFaltasJustificadas = freqAluno.filter((a) => a.status === "FJ").length;

                return {
                    id: aluno._id,
                    nome: aluno.name,
                    totalPorMateria,
                    frequencia: {
                        totalAulas,
                        totalPresencas,
                        totalFaltas,
                        totalFaltasJustificadas,
                        percentualPresenca: totalAulas > 0 ? ((totalPresencas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltas: totalAulas > 0 ? ((totalFaltas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltasJustificadas: totalAulas > 0 ? ((totalFaltasJustificadas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                    }
                };
            })
        );

        // Retorno com informações da turma e dos professores
        return res.status(200).json({
            success: true,
            message: "Boletins gerados com sucesso.",
            data: {
                boletins,
                turma: {
                    id: cla$$._id,
                    nome: cla$$.name_class,
                    regente: cla$$.classRegentTeacher.map(teacher => ({
                        id: teacher._id,
                        nome: teacher.name
                    })),
                },
                bimestre: {
                    totalGrade: bimonthly.totalGrade,
                    averageGrade: bimonthly.averageGrade,
                }
            }
        });

    } catch(error) {
        console.error("Erro ao gerar boletins:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao gerar boletins.",
            error: error.message
        });
    }

    async allTheBulletinsConcept(req, res) {
        const {
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body.idClass;

        console.log("dados dos boletins", req.body)

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('physicalEducationTeacher');


        let bimonthly = null;

        if (id_iStQuarter) {
            bimonthly = await I_stQuarter.findOne({ _id: id_iStQuarter });
        }

        if (id_iiNdQuarter) {
            bimonthly = await II_ndQuarter.findOne({ _id: id_iiNdQuarter });
        }

        if (id_iiiRdQuarter) {
            bimonthly = await III_rdQuarter.findOne({ _id: id_iiiRdQuarter });
        }

        if (id_ivThQuarter) {
            bimonthly = await IV_thQuarter.findOne({ _id: id_ivThQuarter });
        }

        // Se bimonthly tiver dados de data, monta o intervalo
        let attendance = [];
        if (bimonthly) {
            const startDate = new Date(
                Number(bimonthly.startyear),
                Number(bimonthly.startmonth) - 1, // mês começa em 0 no JS
                Number(bimonthly.startday)
            );
            const endDate = new Date(
                Number(bimonthly.endyear),
                Number(bimonthly.endmonth) - 1, // mês começa em 0 no JS
                Number(bimonthly.endday),
                23, 59, 59 // inclui até o final do dia
            );
            console.log("bimonthly", bimonthly)
            console.log("startDate", startDate, "endDate", endDate)
            attendance = await Attendance.find({
                id_class: idClass, // Filtra pela turma
                date: {
                    $gte: startDate, // Maior ou igual a data de início
                    $lte: endDate    // Menor ou igual a data de fim
                }
            }).populate('id_teacher');
        }

        const filter = {};

        // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

        // Para cada aluno, busca suas notas e soma por matéria
        const boletins = await Promise.all(
            cla$$.id_student.map(async (aluno) => {
                const filter = {
                    id_student: aluno._id,
                    id_class: idClass,
                };

                // Filtro por bimestre
                if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
                if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
                if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
                if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

                const grades = await Concept.find(filter).populate('id_matter');

                //console.log("grades", grades);

                const totalPorMateria = {};

                grades.forEach((g) => {
                    const nomeMateria = g.id_matter?.name || 'Matéria não definida';
                    const nota = g.studentGrade;

                    if (!totalPorMateria[nomeMateria]) {
                        totalPorMateria[nomeMateria] = nota;  // Se não existe, inicia com o conceito atual
                    } else {
                        totalPorMateria[nomeMateria] += `, ${nota}`; // Se já existe, concatena
                    }
                });


                // 🔥 Frequência desse aluno no período filtrado
                const freqAluno = attendance.filter(
                    (a) => String(a.id_student) === String(aluno._id)
                );

                const totalAulas = freqAluno.length;
                const totalPresencas = freqAluno.filter((a) => a.status === "P").length;
                const totalFaltas = freqAluno.filter((a) => a.status === "F").length;
                const totalFaltasJustificadas = freqAluno.filter((a) => a.status === "FJ").length;

                return {
                    id: aluno._id,
                    nome: aluno.name,
                    totalPorMateria,
                    frequencia: {
                        totalAulas,
                        totalPresencas,
                        totalFaltas,
                        totalFaltasJustificadas,
                        percentualPresenca: totalAulas > 0 ? ((totalPresencas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltas: totalAulas > 0 ? ((totalFaltas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltasJustificadas: totalAulas > 0 ? ((totalFaltasJustificadas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                    }
                };
            })
        );

        // Retorno com informações da turma e dos professores
        return res.status(200).json({
            success: true,
            message: "Boletins gerados com sucesso.",
            data: {
                boletins,
                turma: {
                    id: cla$$._id,
                    nome: cla$$.name_class,
                    regente: cla$$.classRegentTeacher.map(teacher => ({
                        id: teacher._id,
                        nome: teacher.name
                    })),
                },
                /*bimestre: {
                    totalGrade: bimonthly.totalGrade,
                    averageGrade: bimonthly.averageGrade,
                }*/
            }
        });

    } catch(error) {
        console.error("Erro ao gerar boletins:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao gerar boletins.",
            error: error.message
        });
    }

}

module.exports = new RepoCardController();