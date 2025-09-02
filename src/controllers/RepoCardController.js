const ReportCard = require("../models/Report_card")
const Employee = require("../models/Employee")
const Student = require("../models/Student")
const Cards = require("../models/Report_card")
const Matter = require("../models/Matter")
const NumericalGrade = require("../models/NumericalGrade")
const Concept = require("../models/Grade")
const FinalConcepts = require("../models/FinalConcepts")
const Attendance = require("../models/Attendance")

const I_stQuarter = require("../models/I_stQuarter")
const II_ndQuarter = require("../models/II_ndQuarter")
const III_rdQuarter = require("../models/III_rdQuarter")
const IV_thQuarter = require("../models/IV_thQuarter")
const Class = require("../models/Class")

class RepoCardController {

    async createCardGrade(req, res) {
        const {
            year,
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body.year;

        console.log("log boletin", req.body)

        if (!year) return res.status(422).json({ msg: "O Ano é obrigatório!" });
        if (!idClass) return res.status(422).json({ msg: "O ID turma é obrigatório!" });

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_school')
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('physicalEducationTeacher');

        //console.log("$$", cla$$)

        const physicalEducationTeacherId = (cla$$.physicalEducationTeacher && cla$$.physicalEducationTeacher.length > 0)
            ? String(cla$$.physicalEducationTeacher[0]._id)
            : null;

        // Monta dinamicamente o filtro com base nos bimestres recebidos, ano e turma
        const filter = { idClass, year };
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

        // Verifica e remove boletins existentes da turma no ano e bimestres informados
        const existingReports = await ReportCard.find(filter);

        if (existingReports.length > 0) {
            console.log("Boletins a serem removidos:", existingReports.map(r => ({
                id: r._id,
                aluno: r.nameStudent,
                bimestre: r.bimonthly
            })));

            await ReportCard.deleteMany(filter);
        }

        await Promise.all(
            cla$$.id_student.map(async (aluno) => {

                const studentName = aluno.name;
                const teacherNames = cla$$.classRegentTeacher?.map(t => t.name).join(', ') || "Professor não definido";
                const idTeacher = cla$$.classRegentTeacher?.map(t => t._id).join(', ') || "Professor não definido";
                const schoolNames = cla$$.id_school.name;

                //console.log("schoolNames", schoolNames)


                let bimonthly = null;

                if (id_iStQuarter) bimonthly = await I_stQuarter.findOne({ _id: id_iStQuarter });
                if (id_iiNdQuarter) bimonthly = await II_ndQuarter.findOne({ _id: id_iiNdQuarter });
                if (id_iiiRdQuarter) bimonthly = await III_rdQuarter.findOne({ _id: id_iiiRdQuarter });
                if (id_ivThQuarter) bimonthly = await IV_thQuarter.findOne({ _id: id_ivThQuarter });

                if (!bimonthly) return;

                //console.log("bimonthly", bimonthly)

                const startDate = new Date(`${bimonthly.startyear}-${String(bimonthly.startmonth).padStart(2, '0')}-${String(bimonthly.startday).padStart(2, '0')}T00:00:00.000Z`);
                const endDate = new Date(`${bimonthly.endyear}-${String(bimonthly.endmonth).padStart(2, '0')}-${String(bimonthly.endday).padStart(2, '0')}T23:59:59.999Z`);

                const mongoose = require("mongoose");

                const attendance = await Attendance.aggregate([
                    {
                        $match: {
                            id_class: new mongoose.Types.ObjectId(idClass),
                            //id_teacher: { $ne: physicalEducationTeacherId ? new mongoose.Types.ObjectId(physicalEducationTeacherId) : null }
                            isPhysicalEducation: { $ne: true } // ✅ só pega chamadas que NÃO são de Ed. Física
                        }
                    },
                    {
                        $addFields: {
                            dateOnly: {
                                $dateFromParts: {
                                    year: { $year: "$date" },
                                    month: { $month: "$date" },
                                    day: { $dayOfMonth: "$date" }
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            dateOnly: {
                                $dateFromParts: {
                                    year: { $year: "$date" },
                                    month: { $month: "$date" },
                                    day: { $dayOfMonth: "$date" }
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            dateOnly: {
                                $gte: new Date(startDate.toISOString().split("T")[0]),
                                $lte: new Date(endDate.toISOString().split("T")[0])
                            }
                        }
                    }
                ]);

                const filter = {
                    id_student: aluno._id,
                    id_class: idClass,
                };

                // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
                if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
                if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
                if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
                if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

                let grades = [];

                if (filter.id_iStQuarter || filter.id_iiNdQuarter || filter.id_iiiRdQuarter || filter.id_ivThQuarter) {
                    grades = await NumericalGrade.find(filter).populate('id_matter');
                }

                const totalPorMateria = {};
                grades.forEach((g) => {
                    const nomeMateria = g.id_matter?.name || 'Matéria não definida';
                    const nota = typeof g.studentGrade === 'number'
                        ? g.studentGrade
                        : parseFloat(String(g.studentGrade).replace(',', '.')) || 0;


                    if (!totalPorMateria[nomeMateria]) {
                        totalPorMateria[nomeMateria] = 0;
                    }

                    totalPorMateria[nomeMateria] += nota;
                });

                const freqAluno = attendance.filter(a => String(a.id_student) === String(aluno._id));

                const totalAulas = freqAluno.length;
                const totalPresencas = freqAluno.filter((a) => a.status === "P").length;
                const totalFaltas = freqAluno.filter((a) => a.status === "F").length;
                const totalFaltasJustificadas = freqAluno.filter((a) => a.status === "FJ").length;

                const report = new ReportCard({
                    nameStudent: studentName,
                    nameTeacher: teacherNames,
                    nameSchool: schoolNames,
                    year,
                    bimonthly: bimonthly.bimonthly,
                    id_iStQuarter,
                    id_iiNdQuarter,
                    id_iiiRdQuarter,
                    id_ivThQuarter,
                    id_student: aluno._id,
                    idTeacher: idTeacher,
                    idClass: idClass,
                    studentGrade: totalPorMateria,
                    frequencia: {
                        totalAulas,
                        totalPresencas,
                        totalFaltas,
                        totalFaltasJustificadas,
                        percentualPresenca: totalAulas > 0 ? ((totalPresencas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltas: totalAulas > 0 ? ((totalFaltas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltasJustificadas: totalAulas > 0 ? ((totalFaltasJustificadas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                    },
                    totalGrade: bimonthly.totalGrade,
                    averageGrade: bimonthly.averageGrade,
                });

                await report.save();
                //console.log("Boletim salvo:", report);
            })
        );

        return res.status(201).json({ msg: "Boletins gerados com sucesso!" });
    }

    async createCardConcept(req, res) {
        const {
            year,
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body.year;

        if (!year) return res.status(422).json({ msg: "O Ano é obrigatório!" });
        if (!idClass) return res.status(422).json({ msg: "O ID turma é obrigatório!" });

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_school')
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('physicalEducationTeacher');

        //console.log("$$", cla$$)

        const physicalEducationTeacherId = (cla$$.physicalEducationTeacher && cla$$.physicalEducationTeacher.length > 0)
            ? String(cla$$.physicalEducationTeacher[0]._id)
            : null;

        // Monta dinamicamente o filtro com base nos bimestres recebidos, ano e turma
        const filter = { idClass, year };
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

        // Verifica e remove boletins existentes da turma no ano e bimestres informados
        const existingReports = await ReportCard.find(filter);

        if (existingReports.length > 0) {
            console.log("Boletins a serem removidos:", existingReports.map(r => ({
                id: r._id,
                aluno: r.nameStudent,
                bimestre: r.bimonthly
            })));

            await ReportCard.deleteMany(filter);
        }

        await Promise.all(
            cla$$.id_student.map(async (aluno) => {

                const studentName = aluno.name;
                const teacherNames = cla$$.classRegentTeacher?.map(t => t.name).join(', ') || "Professor não definido";
                const idTeacher = cla$$.classRegentTeacher?.map(t => t._id).join(', ') || "Professor não definido";
                const schoolNames = cla$$.id_school.name;

                //console.log("schoolNames", schoolNames)


                let bimonthly = null;

                if (id_iStQuarter) bimonthly = await I_stQuarter.findOne({ _id: id_iStQuarter });
                if (id_iiNdQuarter) bimonthly = await II_ndQuarter.findOne({ _id: id_iiNdQuarter });
                if (id_iiiRdQuarter) bimonthly = await III_rdQuarter.findOne({ _id: id_iiiRdQuarter });
                if (id_ivThQuarter) bimonthly = await IV_thQuarter.findOne({ _id: id_ivThQuarter });

                if (!bimonthly) return;

                //console.log("bimonthly", bimonthly)

                const startDate = new Date(`${bimonthly.startyear}-${String(bimonthly.startmonth).padStart(2, '0')}-${String(bimonthly.startday).padStart(2, '0')}T00:00:00.000Z`);
                const endDate = new Date(`${bimonthly.endyear}-${String(bimonthly.endmonth).padStart(2, '0')}-${String(bimonthly.endday).padStart(2, '0')}T23:59:59.999Z`);

                const mongoose = require("mongoose");

                const attendance = await Attendance.aggregate([
                    {
                        $match: {
                            id_class: new mongoose.Types.ObjectId(idClass),
                            //id_teacher: { $ne: physicalEducationTeacherId ? new mongoose.Types.ObjectId(physicalEducationTeacherId) : null }
                            isPhysicalEducation: { $ne: true } // ✅ só pega chamadas que NÃO são de Ed. Física
                        }
                    },
                    {
                        $addFields: {
                            dateOnly: {
                                $dateFromParts: {
                                    year: { $year: "$date" },
                                    month: { $month: "$date" },
                                    day: { $dayOfMonth: "$date" }
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            dateOnly: {
                                $dateFromParts: {
                                    year: { $year: "$date" },
                                    month: { $month: "$date" },
                                    day: { $dayOfMonth: "$date" }
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            dateOnly: {
                                $gte: new Date(startDate.toISOString().split("T")[0]),
                                $lte: new Date(endDate.toISOString().split("T")[0])
                            }
                        }
                    }
                ]);

                const filter = {
                    id_student: aluno._id,
                    id_class: idClass,
                };

                // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
                if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
                if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
                if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
                if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

                //let grades = [];

                const grades = await Concept.find(filter).populate('id_matter');

                console.log("grades", grades);
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

                const freqAluno = attendance.filter(a => String(a.id_student) === String(aluno._id));

                const totalAulas = freqAluno.length;
                const totalPresencas = freqAluno.filter((a) => a.status === "P").length;
                const totalFaltas = freqAluno.filter((a) => a.status === "F").length;
                const totalFaltasJustificadas = freqAluno.filter((a) => a.status === "FJ").length;

                const report = new ReportCard({
                    nameStudent: studentName,
                    nameTeacher: teacherNames,
                    nameSchool: schoolNames,
                    year,
                    bimonthly: bimonthly.bimonthly,
                    id_iStQuarter,
                    id_iiNdQuarter,
                    id_iiiRdQuarter,
                    id_ivThQuarter,
                    id_student: aluno._id,
                    idTeacher: idTeacher,
                    idClass: idClass,
                    studentGrade: totalPorMateria,
                    frequencia: {
                        totalAulas,
                        totalPresencas,
                        totalFaltas,
                        totalFaltasJustificadas,
                        percentualPresenca: totalAulas > 0 ? ((totalPresencas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltas: totalAulas > 0 ? ((totalFaltas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                        percentualFaltasJustificadas: totalAulas > 0 ? ((totalFaltasJustificadas / totalAulas) * 100).toFixed(2) + "%" : "0%",
                    },
                });

                await report.save();
                //console.log("Boletim salvo:", report);
            })
        );
        return res.status(201).json({ msg: "Boletins gerados com sucesso!" });
    }

    async allTheBulletinsGrades(req, res) {
        const {
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body.idClass;

        //console.log("dados dos boletins", req.body)

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('physicalEducationTeacher');

        // console.log("cla$$", cla$$)
        const physicalEducationTeacherId = (cla$$.physicalEducationTeacher && cla$$.physicalEducationTeacher.length > 0)
            ? String(cla$$.physicalEducationTeacher[0]._id)
            : null;

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
            /*const startDate = new Date(
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
            //console.log("bimonthly", bimonthly)
            //console.log("startDate", startDate, "endDate", endDate)

            attendance = await Attendance.find({
                id_class: idClass, // Filtra pela turma
                date: {
                    $gte: startDate, // Maior ou igual a data de início
                    $lte: endDate    // Menor ou igual a data de fim
                },
                id_teacher: { $ne: physicalEducationTeacherId }
            }).populate('id_teacher');*/

            const startDate = new Date(`${bimonthly.startyear}-${String(bimonthly.startmonth).padStart(2, '0')}-${String(bimonthly.startday).padStart(2, '0')}T00:00:00.000Z`);
            const endDate = new Date(`${bimonthly.endyear}-${String(bimonthly.endmonth).padStart(2, '0')}-${String(bimonthly.endday).padStart(2, '0')}T23:59:59.999Z`);

            const mongoose = require("mongoose");

            attendance = await Attendance.aggregate([
                {
                    $match: {
                        id_class: new mongoose.Types.ObjectId(idClass),
                        //id_teacher: { $ne: physicalEducationTeacherId ? new mongoose.Types.ObjectId(physicalEducationTeacherId) : null }
                        isPhysicalEducation: { $ne: true } // ✅ só pega chamadas que NÃO são de Ed. Física
                    }
                },
                {
                    $addFields: {
                        dateOnly: {
                            $dateFromParts: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                                day: { $dayOfMonth: "$date" }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        dateOnly: {
                            $dateFromParts: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                                day: { $dayOfMonth: "$date" }
                            }
                        }
                    }
                },
                {
                    $match: {
                        dateOnly: {
                            $gte: new Date(startDate.toISOString().split("T")[0]),
                            $lte: new Date(endDate.toISOString().split("T")[0])
                        }
                    }
                }
            ]);

            console.log("attendance", attendance)
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

        // console.log("cla$$", cla$$)
        const physicalEducationTeacherId = (cla$$.physicalEducationTeacher && cla$$.physicalEducationTeacher.length > 0)
            ? String(cla$$.physicalEducationTeacher[0]._id)
            : null;

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
            const startDate = new Date(`${bimonthly.startyear}-${String(bimonthly.startmonth).padStart(2, '0')}-${String(bimonthly.startday).padStart(2, '0')}T00:00:00.000Z`);
            const endDate = new Date(`${bimonthly.endyear}-${String(bimonthly.endmonth).padStart(2, '0')}-${String(bimonthly.endday).padStart(2, '0')}T23:59:59.999Z`);

            const mongoose = require("mongoose");

            attendance = await Attendance.aggregate([
                {
                    $match: {
                        id_class: new mongoose.Types.ObjectId(idClass),
                        //id_teacher: { $ne: physicalEducationTeacherId ? new mongoose.Types.ObjectId(physicalEducationTeacherId) : null }
                        isPhysicalEducation: { $ne: true } // ✅ só pega chamadas que NÃO são de Ed. Física
                    }
                },
                {
                    $addFields: {
                        dateOnly: {
                            $dateFromParts: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                                day: { $dayOfMonth: "$date" }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        dateOnly: {
                            $dateFromParts: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                                day: { $dayOfMonth: "$date" }
                            }
                        }
                    }
                },
                {
                    $match: {
                        dateOnly: {
                            $gte: new Date(startDate.toISOString().split("T")[0]),
                            $lte: new Date(endDate.toISOString().split("T")[0])
                        }
                    }
                }
            ]);
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

    async allTheFinalBulletinsConcept(req, res) {
        const {
            idClass,
        } = req.body.idClass;

        console.log("dados dos boletins", req.body)

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('physicalEducationTeacher');

        // console.log("cla$$", cla$$)
        const physicalEducationTeacherId = (cla$$.physicalEducationTeacher && cla$$.physicalEducationTeacher.length > 0)
            ? String(cla$$.physicalEducationTeacher[0]._id)
            : null;

        //let bimonthly = null;
        console.log('ano da turma', cla$$.year)
        const currentYear = cla$$.year; // 🔥 Ano atual como string

        // Se bimonthly tiver dados de data, monta o intervalo
        let attendance = [];
        attendance = await Attendance.find({
            id_class: idClass, // Filtra pela turma
            year: currentYear,
            //id_teacher: { $ne: physicalEducationTeacherId }
            isPhysicalEducation: { $ne: true } // ✅ só pega chamadas que NÃO são de Ed. Física
        }).populate('id_teacher');

        // Para cada aluno, busca suas notas e soma por matéria
        const boletins = await Promise.all(
            cla$$.id_student.map(async (aluno) => {
                const filter = {
                    id_student: aluno._id,
                    id_class: idClass,
                    year: currentYear,
                };

                const grades = await FinalConcepts.find(filter).populate('id_matter');

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