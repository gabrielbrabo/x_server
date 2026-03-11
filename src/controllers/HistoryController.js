const History = require("../models/History");
const Certificate = require("../models/CertificateSchema");
const Student = require("../models/Student");
const Class = require("../models/Class");
const School = require("../models/School");
const ReportCard = require("../models/Report_card");
const IStQuarter = require("../models/I_stQuarter");
const IINdQuarter = require("../models/II_ndQuarter");
const IIIrdQuarter = require("../models/III_rdQuarter");
const IVThQuarter = require("../models/IV_thQuarter");
const FinalConcepts = require("../models/FinalConcepts");

class HistoryController {
    // Finaliza o ano letivo criando histórico de todos os alunos da escola
    async createHistoryGrade(req, res) {
        try {
            const { idSchool, year } = req.body;

            // Buscar a escola
            const school = await School.findById(idSchool)
                .populate("id_student")
                .populate("educationDepartment")
                .lean();
            console.log("school", school)
            if (!school) {
                return res.status(404).json({ message: "Escola não encontrada" });
            }

            // 🔍 Verifica se já existem históricos salvos para este ano e escola
            const existingHistories = await History.find({
                id_school: idSchool,
                year: year.toString()
            });

            if (existingHistories.length > 0) {
                console.warn(`Históricos existentes encontrados para a escola ${school.name} (${year}). Apagando...`);
                await History.deleteMany({
                    id_school: idSchool,
                    year: year.toString()
                });
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

                // Copiar todos os dados dos reportCards (sem apenas IDs)
                const reportCardData = reportCards.map(rc => ({
                    _id: rc._id,
                    frequencia: rc.frequencia,
                    nameStudent: rc.nameStudent,
                    nameTeacher: rc.nameTeacher,
                    //nameSchool: rc.nameSchool,
                    year: rc.year,
                    bimonthly: rc.bimonthly,
                    totalGrade: rc.totalGrade,
                    averageGrade: rc.averageGrade,
                    studentGrade: rc.studentGrade,
                    id_iStQuarter: rc.id_iStQuarter,
                    id_iiNdQuarter: rc.id_iiNdQuarter,
                    id_iiiRdQuarter: rc.id_iiiRdQuarter,
                    id_ivThQuarter: rc.id_ivThQuarter,
                    id_student: rc.id_student,
                    idTeacher: rc.idTeacher,
                    idTeacher02: rc.idTeacher02,
                    idClass: rc.idClass,
                    //createdAt: rc.createdAt,
                    //updatedAt: rc.updatedAt
                }));

                const history = {
                    id_school: idSchool,
                    nameStudent: student.name,
                    nameTeacher: classData?.classRegentTeacher?.[0]?.name || "Professor não informado",
                    nameSchool: school.name,
                    municipality: school.educationDepartment.municipality,
                    state: school.educationDepartment.state,
                    year: year.toString(),
                    dailyWorkload: '4',
                    annualSchoolDays: '200',
                    serie: classData?.serie || "",
                    nameClass: classData?.name || "Turma não identificada",
                    totalGrade: totalGrade,
                    averageGrade: averageGrade,
                    reportCard: reportCardData,
                    id_student: student._id,
                    idTeacher: classData?.classRegentTeacher?.[0]?._id || null,
                    idClass: classData?._id || null
                };

                historiesToSave.push(history);
            }

            // Salvar todos os históricos
            const savedHistories = await History.insertMany(historiesToSave);

            return res.status(201).json({
                message: "Históricos de todos os alunos da escola criados com sucesso!",
                total: historiesToSave.length,
                histories: savedHistories,
            });

        } catch (error) {
            console.error("Erro ao finalizar o ano letivo:", error);
            return res.status(500).json({
                message: "Erro ao criar históricos dos alunos",
                error: error.message,
            });
        }
    }

    // Finaliza o ano letivo criando histórico de todos os alunos da escola
    async createHistoryConcept(req, res) {
        try {
            const { idSchool, year } = req.body;

            // Buscar a escola
            const school = await School.findById(idSchool)
                .populate("id_student")
                .populate("educationDepartment")
                .lean();
            console.log("school", school)
            if (!school) {
                return res.status(404).json({ message: "Escola não encontrada" });
            }

            // 🔍 Verifica se já existem históricos salvos para este ano e escola
            const existingHistories = await History.find({
                id_school: idSchool,
                year: year.toString()
            });

            if (existingHistories.length > 0) {
                console.warn(`Históricos existentes encontrados para a escola ${school.name} (${year}). Apagando...`);
                await History.deleteMany({
                    id_school: idSchool,
                    year: year.toString()
                });
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

                // Copiar todos os dados dos reportCards (sem apenas IDs)
                const reportCardData = reportCards.map(rc => ({
                    _id: rc._id,
                    frequencia: rc.frequencia,
                    nameStudent: rc.nameStudent,
                    nameTeacher: rc.nameTeacher,
                    //nameSchool: rc.nameSchool,
                    year: rc.year,
                    bimonthly: rc.bimonthly,
                    totalGrade: rc.totalGrade,
                    averageGrade: rc.averageGrade,
                    studentGrade: rc.studentGrade,
                    id_iStQuarter: rc.id_iStQuarter,
                    id_iiNdQuarter: rc.id_iiNdQuarter,
                    id_iiiRdQuarter: rc.id_iiiRdQuarter,
                    id_ivThQuarter: rc.id_ivThQuarter,
                    id_student: rc.id_student,
                    idTeacher: rc.idTeacher,
                    idTeacher02: rc.idTeacher02,
                    idClass: rc.idClass,
                    //createdAt: rc.createdAt,
                    //updatedAt: rc.updatedAt
                }));

                const concepts = await FinalConcepts.find({
                    id_student: student._id,
                    year: year.toString()
                }).lean();
                
                const finalConcepts = concepts.map(c => ({
                    id_matter: c.id_matter,
                    concept: c.studentGrade
                }));                

                const history = {
                    id_school: idSchool,
                    nameStudent: student.name,
                    nameTeacher: classData?.classRegentTeacher?.[0]?.name || "Professor não informado",
                    nameSchool: school.name,
                    municipality: school.educationDepartment.municipality,
                    state: school.educationDepartment.state,
                    year: year.toString(),
                    dailyWorkload: '4',
                    annualSchoolDays: '200',
                    serie: classData?.serie || "",
                    nameClass: classData?.name || "Turma não identificada",
                    //totalGrade: totalGrade,
                    //averageGrade: averageGrade,
                    reportCard: reportCardData,
                    finalConcepts: finalConcepts,
                    id_student: student._id,
                    idTeacher: classData?.classRegentTeacher?.[0]?._id || null,
                    idClass: classData?._id || null
                };

                historiesToSave.push(history);
            }

            // Salvar todos os históricos
            const savedHistories = await History.insertMany(historiesToSave);

            return res.status(201).json({
                message: "Históricos de todos os alunos da escola criados com sucesso!",
                total: historiesToSave.length,
                histories: savedHistories,
            });

        } catch (error) {
            console.error("Erro ao finalizar o ano letivo:", error);
            return res.status(500).json({
                message: "Erro ao criar históricos dos alunos",
                error: error.message,
            });
        }
    }

    async GetStudentHistory(req, res) {
        try {
            const { id_student } = req.params

            const history = await History.find({ id_student })
                .sort({ createdAt: -1 }) // mais recente primeiro

            return res.status(200).json(history)
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao buscar histórico do aluno'
            })
        }
    }

    async updateHistory(req, res) {
        try {
            const { id } = req.params

            const history = await History.findById(id)

            if (!history) {
                return res.status(404).json({
                    message: "Histórico não encontrado"
                })
            }

            const {
                extraSubjects,
                extraWorkingHours,
                absencesOvertime,
                studentSituation
            } = req.body

            // ✅ Atualizações condicionais
            if (extraSubjects !== undefined) {
                history.extraSubjects = extraSubjects
            }

            if (extraWorkingHours !== undefined) {
                history.extraWorkingHours = extraWorkingHours
            }

            if (absencesOvertime !== undefined) {
                history.absencesOvertime = absencesOvertime
            }

            if (studentSituation !== undefined) {
                history.studentSituation = studentSituation
            }

            await history.save()

            return res.status(200).json({
                message: "Histórico atualizado com sucesso",
                history
            })

        } catch (error) {
            console.error("Erro ao editar histórico:", error)
            return res.status(500).json({
                message: "Erro ao editar histórico"
            })
        }
    }

    async updateHistoryFrequency(req, res) {
        try {
            const { id } = req.params
            const { frequencias } = req.body
    
            const history = await History.findById(id)
            if (!history) {
                return res.status(404).json({ message: 'Histórico não encontrado' })
            }
    
            frequencias.forEach(({ reportCardId, frequencia }) => {
                const reportCard = history.reportCard.find(
                    rc => rc._id.toString() === reportCardId
                )
    
                if (!reportCard) return
    
                reportCard.frequencia = {
                    totalPresencas: Number(frequencia.totalPresencas) || 0,
                    totalFaltas: Number(frequencia.totalFaltas) || 0,
                    totalFaltasJustificadas:
                        Number(frequencia.totalFaltasJustificadas) || 0,
                    totalAulas: Number(frequencia.totalAulas) || 0
                }
            })
    
            console.log(history.reportCard.map(rc => rc.frequencia))

            // 🔥 ESSENCIAL
            history.markModified('reportCard')
            await history.save()
    
            return res.json({ message: 'Frequências atualizadas com sucesso' })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Erro ao atualizar frequências' })
        }
    }
    

    async createManualHistory(req, res) {
        try {
            /* ===============================
               DADOS VINDOS DO FRONT
               (payload manual)
            =============================== */
            const {
                id_student,
                // id_school,   // 🔕 não usado no manual por enquanto
                // idTeacher,   // 🔕 opcional
                // idClass,     // 🔕 opcional

                nameStudent,
                // nameTeacher, // 🔕 ainda não vem do front
                nameSchool,
                municipality,
                state,

                year,
                serie,

                totalGrade,
                averageGrade,

                // nameClass,   // 🔕 não obrigatório no modelo
                dailyWorkload,
                annualSchoolDays,

                grades,        // { MATEMATICA: "80", PORTUGUES: "70" }
                frequencia     // objeto de frequência anual
            } = req.body
            console.log("req.body", req.body)

            if (
                !id_student ||
                !nameStudent ||
                !year ||
                !serie ||
                !totalGrade ||
                !averageGrade ||
                !dailyWorkload ||
                !annualSchoolDays ||
                !grades ||
                Object.keys(grades).length === 0 ||
                !frequencia
            ) {
                return res.status(400).json({
                    message: "Existem campos obrigatórios vazios ou não enviados"
                })
            }

            if (
                frequencia.totalAulas == null ||
                frequencia.totalPresencas == null ||
                frequencia.totalFaltas == null ||
                frequencia.totalFaltasJustificadas == null
            ) {
                return res.status(400).json({
                    message: "Campos de frequência incompletos"
                })
            }

            for (const materia in grades) {
                if (grades[materia] === "" || grades[materia] == null) {
                    return res.status(400).json({
                        message: `Nota da matéria ${materia} está vazia`
                    })
                }
            }

            /* ===============================
               studentGrade (EXATO DO MODEL)
            =============================== */
            const studentGrade = {}

            Object.entries(grades || {}).forEach(([materia, nota]) => {
                studentGrade[materia] = {
                    total: Number(nota) || 0,
                    atividades: [] // 🔒 obrigatório pelo model
                }
            })

            /* ===============================
               FREQUÊNCIA (FORMATO DO MODEL)
            =============================== */
            const totalAulas = Number(frequencia?.totalAulas) || 0
            const totalPresencas = Number(frequencia?.totalPresencas) || 0
            const totalFaltas = Number(frequencia?.totalFaltas) || 0
            const totalFaltasJustificadas =
                Number(frequencia?.totalFaltasJustificadas) || 0

            const frequenciaFinal = {
                totalAulas,
                totalPresencas,
                totalFaltas,
                totalFaltasJustificadas,

                percentualPresenca: totalAulas
                    ? ((totalPresencas / totalAulas) * 100).toFixed(2) + "%"
                    : "0.00%",

                percentualFaltas: totalAulas
                    ? ((totalFaltas / totalAulas) * 100).toFixed(2) + "%"
                    : "0.00%",

                percentualFaltasJustificadas: totalAulas
                    ? ((totalFaltasJustificadas / totalAulas) * 100).toFixed(2) + "%"
                    : "0.00%"
            }

            /* ===============================
               REPORT CARD
               🔹 manual → mesmo boletim replicado
               🔹 formato EXATO do histórico
            =============================== */
            const bimestres = [
                "1º BIMESTRE",
            ]

            const reportCard = bimestres.map(bim => ({
                frequencia: frequenciaFinal,

                nameStudent: nameStudent?.toUpperCase(),
                nameTeacher: "", // 🔕 não informado no manual
                year,
                bimonthly: bim,

                totalGrade,
                averageGrade,

                studentGrade,

                id_student,
                // idTeacher,
                // idClass
            }))

            /* ===============================
               OBJETO FINAL DO HISTÓRICO
               🔍 PREVIEW ANTES DE SALVAR
            =============================== */
            const historyData = {
                // id_school,
                id_student,
                // idTeacher,
                // idClass,

                nameStudent: nameStudent?.toUpperCase(),
                nameTeacher: "", // 🔕 opcional
                nameSchool: nameSchool?.toUpperCase(),
                municipality: municipality?.toUpperCase(),
                state: state?.toUpperCase(),

                year,
                serie,

                totalGrade,
                averageGrade,

                dailyWorkload: Number(dailyWorkload),
                annualSchoolDays: Number(annualSchoolDays),

                reportCard,

                createdManually: true // 🔥 AQUI
            }

            /* ===============================
           🔒 VERIFICA SE JÁ EXISTE HISTÓRICO
           (mesmo aluno + ano + série)
        =============================== */
            const yearExists = await History.findOne({
                id_student,
                year,
            })

            if (yearExists) {
                return res.status(409).json({
                    message: "Já existe um histórico cadastrado para este aluno nesse ano."
                })
            }

            const serieExists = await History.findOne({
                id_student,
                serie
            })

            if (serieExists) {
                return res.status(409).json({
                    message: "Já existe um histórico cadastrado para este aluno nessa série."
                })
            }

            /* ===============================
               DEBUG / VISUALIZAÇÃO
            =============================== */
            console.log(
                "📘 HISTORY (ANTES DE SALVAR):\n",
                JSON.stringify(historyData, null, 2)
            )

            /* ===============================
               SALVAR NO BANCO
            =============================== */
            const history = await History.create(historyData)

            return res.status(201).json({
                message: "Histórico criado manualmente com sucesso",
                history
            })

        } catch (error) {
            console.error("Erro ao criar histórico manual:", error)
            return res.status(500).json({
                message: "Erro ao criar histórico manual",
                error: error.message
            })
        }
    }

    async updateManualHistory(req, res) {
        try {
            const { id } = req.params

            const {
                year,
                serie,
                nameSchool,
                municipality,
                state,
                grades,
                dailyWorkload,
                annualSchoolDays,
                totalGrade,
                averageGrade,
                reportCard
            } = req.body

            // 🔒 validação básica
            if (!id) {
                return res.status(400).json({ message: 'ID do histórico não informado' })
            }

            // 🔎 histórico existe?
            const history = await History.findById(id)
            if (!history) {
                return res.status(404).json({ message: 'Histórico não encontrado' })
            }

            // 🔒 opcional: impedir edição automática
            if (!history.createdManually) {
                return res.status(403).json({
                    message: 'Este histórico não pode ser editado'
                })
            }

            // =====================================
            // 🔎 VERIFICA CONFLITO DE ANO + SÉRIE
            // =====================================
            const yearChanged = String(history.year) !== String(year)
            const serieChanged = String(history.serie) !== String(serie)

            if (yearChanged || serieChanged) {
                const conflictYear = await History.findOne({
                    _id: { $ne: history._id }, // ignora o próprio
                    student: history.student, // mesmo aluno
                    year
                })

                const conflictSerie = await History.findOne({
                    _id: { $ne: history._id }, // ignora o próprio
                    student: history.student, // mesmo aluno
                    serie
                })

                if (conflictYear) {
                    return res.status(409).json({
                        message: `O aluno já possui um histórico em ${year}`
                    })
                }

                if (conflictSerie) {
                    return res.status(409).json({
                        message: `O aluno já possui um histórico no ${serie}`
                    })
                }
            }

            // =========================
            // ATUALIZA DADOS GERAIS
            // =========================
            history.year = year
            history.serie = serie
            history.nameSchool = nameSchool
            history.municipality = municipality
            history.state = state
            history.dailyWorkload = dailyWorkload
            history.annualSchoolDays = annualSchoolDays
            history.totalGrade = totalGrade
            history.averageGrade = averageGrade

            // =========================
            // ATUALIZA BOLETIM
            // =========================
            if (reportCard && reportCard.length > 0) {
                history.reportCard[0] = {
                    ...history.reportCard[0]._doc,
                    ...reportCard[0]
                }
            }

            await history.save()

            return res.status(200).json({
                message: 'Histórico atualizado com sucesso',
                history
            })

        } catch (error) {
            console.error('Erro ao atualizar histórico:', error)
            return res.status(500).json({
                message: 'Erro interno ao atualizar histórico'
            })
        }
    }

    /**
     * Criar certificado de conclusão
     */
    async createCertificate(req, res) {
        try {
            const {
                student,
                studentName,
                nationality,
                gender,
                birthDate,
                birthCity,
                birthState,
                motherName,
                fatherName,
                course,
                conclusionDate,
                schoolName,
                legalStatus,
                address,
                city,
                state,
                legalBasis,
                observations
            } = req.body;

            console.log("front", req.body)

            // 🔒 Validações obrigatórias (OBSERVATIONS NÃO ENTRA)
            if (
                !student ||
                !studentName ||
                !nationality ||
                !gender ||
                !birthDate ||
                !birthCity ||
                !birthState ||
                !motherName ||
                !fatherName ||
                !conclusionDate ||
                !schoolName ||
                !address ||
                !city ||
                !state
            ) {
                return res.status(400).json({
                    message: 'Campos obrigatórios não informados'
                });
            }

            const certificate = await Certificate.create({
                student,
                issuedBy: req.user?._id, // opcional
                studentName,
                nationality,
                gender,
                birthDate,
                birthCity,
                birthState,
                motherName,
                fatherName,
                course,
                conclusionDate,
                schoolName,
                legalStatus,
                address,
                city,
                state,
                legalBasis,
                observations
            });

            return res.status(201).json({
                message: 'Certificado registrado com sucesso',
                certificate
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao registrar certificado',
                error: error.message
            });
        }
    };

    async getByStudentCertificate(req, res) {
        try {
            const { studentId } = req.params

            const certificate = await Certificate.findOne({
                student: studentId,
                isCanceled: false
            })

            if (!certificate) {
                return res.status(404).json({
                    message: 'Certificado não encontrado'
                })
            }

            return res.status(200).json(certificate)

        } catch (error) {
            console.error('Erro ao buscar certificado:', error)
            return res.status(500).json({
                message: 'Erro interno ao buscar certificado'
            })
        }
    }

    async updateCertificate(req, res) {
        try {
            const { studentId } = req.params;

            const {
                studentName,
                nationality,
                gender,
                birthDate,
                birthCity,
                birthState,
                motherName,
                fatherName,
                course,
                conclusionDate,
                schoolName,
                legalStatus,
                address,
                city,
                state,
                legalBasis,
                observations
            } = req.body;

            // 🔒 validação mínima
            if (!studentId) {
                return res.status(400).json({
                    message: 'ID do aluno não informado'
                });
            }

            const certificate = await Certificate.findOne({ student: studentId });

            if (!certificate) {
                return res.status(404).json({
                    message: 'Certificado não encontrado para este aluno'
                });
            }

            // 🔄 Atualização dos campos
            certificate.studentName = studentName ?? certificate.studentName;
            certificate.nationality = nationality ?? certificate.nationality;
            certificate.gender = gender ?? certificate.gender;
            certificate.birthDate = birthDate ?? certificate.birthDate;
            certificate.birthCity = birthCity ?? certificate.birthCity;
            certificate.birthState = birthState ?? certificate.birthState;
            certificate.motherName = motherName ?? certificate.motherName;
            certificate.fatherName = fatherName ?? certificate.fatherName;

            certificate.course = course ?? certificate.course;
            certificate.conclusionDate = conclusionDate ?? certificate.conclusionDate;

            certificate.schoolName = schoolName ?? certificate.schoolName;
            certificate.legalStatus = legalStatus ?? certificate.legalStatus;
            certificate.address = address ?? certificate.address;
            certificate.city = city ?? certificate.city;
            certificate.state = state ?? certificate.state;

            certificate.legalBasis = legalBasis ?? certificate.legalBasis;
            certificate.observations = observations ?? certificate.observations ?? '';

            await certificate.save();

            return res.status(200).json({
                message: 'Certificado atualizado com sucesso',
                certificate
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao atualizar certificado',
                error: error.message
            });
        }
    }

}

module.exports = new HistoryController();
