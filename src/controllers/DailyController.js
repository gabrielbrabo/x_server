const Daily = require("../models/Daily")
const Employee = require("../models/Employee")
const Student = require("../models/Student")
const Cards = require("../models/Report_card")
const Matter = require("../models/Matter")
const NumericalGrade = require("../models/NumericalGrade")
const Concept = require("../models/Grade")
const FinalConcepts = require("../models/FinalConcepts")
const Attendance = require("../models/Attendance")
const Activities = require("../models/Activities")
const RecordClassTaught = require("../models/RecordClassTaught")
const IndividualForm = require("../models/IndividualForm")

const I_stQuarter = require("../models/I_stQuarter")
const II_ndQuarter = require("../models/II_ndQuarter")
const III_rdQuarter = require("../models/III_rdQuarter")
const IV_thQuarter = require("../models/IV_thQuarter")
const Class = require("../models/Class")

const mongoose = require("mongoose");

class DailyController {

    async createDailyGrade(req, res) {
        const {
            year,
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body.year;
        console.log(req.body)
        if (!year) return res.status(422).json({ msg: "O Ano é obrigatório!" });
        if (!idClass) return res.status(422).json({ msg: "O ID turma é obrigatório!" });

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_school')
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('classRegentTeacher02')
            .populate('physicalEducationTeacher');

        const physicalEducationTeacherId = (cla$$.physicalEducationTeacher && cla$$.physicalEducationTeacher.length > 0)
            ? String(cla$$.physicalEducationTeacher[0]._id)
            : null;

        // Verifica e remove boletins existentes da turma no ano e bimestres informados
        const filterRemove = { idClass, year };
        if (id_iStQuarter) filterRemove.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filterRemove.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filterRemove.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filterRemove.id_ivThQuarter = id_ivThQuarter;

        /*const existingDaily = await Daily.find(filterRemove);

        if (existingDaily.length > 0) {
            console.log("Diario a ser removido:", existingDaily.map(r => ({
                id: r._id,
                Classe: r.nameClass,
                bimestre: r.bimonthly
            })));

            await Daily.deleteMany(filterRemove);
        }

        const idRegentTeacher = (cla$$.classRegentTeacher || []).map(t => t._id);
        const idRegentTeacher02 = (cla$$.classRegentTeacher02 || []).map(t => t._id);
        const idphysicalEducationTeacher = (cla$$.physicalEducationTeacher || []).map(t => t._id);

        const nameRegentTeacher = (cla$$.classRegentTeacher || []).map(t => t.name).join(', ') || "Professor não definido";
        const nameRegentTeacher02 = (cla$$.classRegentTeacher02 || []).map(t => t.name).join(', ') || "Professor não definido";
        const namephysicalEducationTeacher = (cla$$.physicalEducationTeacher || []).map(t => t.name).join(', ') || "Professor não definido";
        */

        // Busca existente e salva nomes:
        const existingDaily = await Daily.findOne(filterRemove);
        const oldNameRegentTeacher = existingDaily?.nameRegentTeacher;
        const oldNameRegentTeacher02 = existingDaily?.nameRegentTeacher02;
        const oldNamePhysicalEducationTeacher = existingDaily?.namephysicalEducationTeacher;

        const oldIdRegentTeacher = existingDaily?.idRegentTeacher;
        const oldIdRegentTeacher02 = existingDaily?.idRegentTeacher02;
        const oldIdPhysicalEducationTeacher = existingDaily?.idPhysicalEducationTeacher;


        // Se existir, apaga:
        if (existingDaily) {
            console.log("Diário a ser removido:", {
                id: existingDaily._id,
                Classe: existingDaily.nameClass,
                bimestre: existingDaily.bimonthly
            });

            await Daily.deleteMany(filterRemove);
        }

        // IDs: usa antigos ou pega da turma
        const idRegentTeacher = oldIdRegentTeacher?.length > 0 ? oldIdRegentTeacher : (cla$$.classRegentTeacher || []).map(t => t._id);
        const idRegentTeacher02 = oldIdRegentTeacher02?.length > 0 ? oldIdRegentTeacher02 : (cla$$.classRegentTeacher02 || []).map(t => t._id);
        const idphysicalEducationTeacher = oldIdPhysicalEducationTeacher?.length > 0 ? oldIdPhysicalEducationTeacher : (cla$$.physicalEducationTeacher || []).map(t => t._id);

        // Pega os nomes da turma OU mantém antigos:
        const nameRegentTeacher = oldNameRegentTeacher || (cla$$.classRegentTeacher || []).map(t => t.name).join(', ') || "Professor não definido";
        const nameRegentTeacher02 = oldNameRegentTeacher02 || (cla$$.classRegentTeacher02 || []).map(t => t.name).join(', ') || "Professor não definido";
        const namephysicalEducationTeacher = oldNamePhysicalEducationTeacher || (cla$$.physicalEducationTeacher || []).map(t => t.name).join(', ') || "Professor não definido";

        const schoolNames = cla$$.id_school.name;

        //console.log("schoolNames", schoolNames)


        let bimonthly = null;

        if (id_iStQuarter) bimonthly = await I_stQuarter.findOne({ _id: id_iStQuarter });
        if (id_iiNdQuarter) bimonthly = await II_ndQuarter.findOne({ _id: id_iiNdQuarter });
        if (id_iiiRdQuarter) bimonthly = await III_rdQuarter.findOne({ _id: id_iiiRdQuarter });
        if (id_ivThQuarter) bimonthly = await IV_thQuarter.findOne({ _id: id_ivThQuarter });

        if (!bimonthly) return;

        //console.log("bimonthly", bimonthly)

        //const startDate = new Date(bimonthly.startyear, bimonthly.startmonth - 1, bimonthly.startday);
        //const endDate = new Date(bimonthly.endyear, bimonthly.endmonth - 1, bimonthly.endday, 23, 59, 59);
        const startDate = new Date(`${bimonthly.startyear}-${String(bimonthly.startmonth).padStart(2, '0')}-${String(bimonthly.startday).padStart(2, '0')}T00:00:00.000Z`);
        const endDate = new Date(`${bimonthly.endyear}-${String(bimonthly.endmonth).padStart(2, '0')}-${String(bimonthly.endday).padStart(2, '0')}T23:59:59.999Z`);

        const mongoose = require("mongoose");

        const attendance = await Attendance.aggregate([
            {
                $match: {
                    id_class: new mongoose.Types.ObjectId(idClass),
                    id_teacher: { $ne: physicalEducationTeacherId ? new mongoose.Types.ObjectId(physicalEducationTeacherId) : null }
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


        console.log("startDate", startDate.toISOString());
        console.log("endDate", endDate.toISOString());

        const recordClassTaught = await RecordClassTaught.aggregate([
            {
                $match: {
                    id_class: new mongoose.Types.ObjectId(idClass)
                }
            },
            {
                $addFields: {
                    dateOnly: {
                        $dateFromParts: {
                            year: { $toInt: "$year" },
                            month: { $toInt: "$month" },
                            day: { $toInt: "$day" }
                        }
                    }
                }
            },
            {
                $match: {
                    dateOnly: { $gte: startDate, $lte: endDate }
                }
            }
        ]);

        const filter = {
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

        const activities = await Activities.find(
            filter
        )

        const daily = new Daily({
            nameRegentTeacher: nameRegentTeacher,
            nameSchool: schoolNames,
            year: year,
            nameClass: cla$$.serie,
            nameRegentTeacher02: nameRegentTeacher02,
            namephysicalEducationTeacher: namephysicalEducationTeacher,
            bimonthly: bimonthly.bimonthly,
            totalGrade: bimonthly.totalGrade,
            averageGrade: bimonthly.averageGrade,
            idActivity: activities,
            studentGrade: grades,
            attendance: attendance,
            id_recordClassTaught: recordClassTaught,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            idRegentTeacher: idRegentTeacher,
            idRegentTeacher02: idRegentTeacher02,
            idPhysicalEducationTeacher: idphysicalEducationTeacher,
            idClass: idClass,
            id_student: cla$$.id_student,
            transferStudents: cla$$.transferStudents
        });

        await daily.save();
        //console.log("daily salvo:", daily);

        // Recarrega o documento com populate
        const populatedDaily = await Daily.findById(daily._id).populate("studentGrade");

        return res.status(201).json({
            msg: "Diário gerado com sucesso!",
            daily: populatedDaily
        });
    }

    async createDailyConcept(req, res) {
        const {
            year,
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body.year;
        console.log(req.body)
        if (!year) return res.status(422).json({ msg: "O Ano é obrigatório!" });
        if (!idClass) return res.status(422).json({ msg: "O ID turma é obrigatório!" });

        const cla$$ = await Class.findOne({ _id: idClass })
            .populate('id_school')
            .populate('id_student')
            .populate('classRegentTeacher')
            .populate('classRegentTeacher02')
            .populate('physicalEducationTeacher');
        //console.log("Cla$$", cla$$)
        const physicalEducationTeacherId = (cla$$.physicalEducationTeacher && cla$$.physicalEducationTeacher.length > 0)
            ? String(cla$$.physicalEducationTeacher[0]._id)
            : null;

        // Verifica e remove boletins existentes da turma no ano e bimestres informados
        const filterRemove = { idClass, year };
        if (id_iStQuarter) filterRemove.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filterRemove.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filterRemove.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filterRemove.id_ivThQuarter = id_ivThQuarter;

        // Busca existente e salva nomes:
        const existingDaily = await Daily.findOne(filterRemove);
        const oldNameRegentTeacher = existingDaily?.nameRegentTeacher;
        const oldNameRegentTeacher02 = existingDaily?.nameRegentTeacher02;
        const oldNamePhysicalEducationTeacher = existingDaily?.namephysicalEducationTeacher;

        const oldIdRegentTeacher = existingDaily?.idRegentTeacher;
        const oldIdRegentTeacher02 = existingDaily?.idRegentTeacher02;
        const oldIdPhysicalEducationTeacher = existingDaily?.idPhysicalEducationTeacher;


        // Se existir, apaga:
        if (existingDaily) {
            console.log("Diário a ser removido:", {
                id: existingDaily._id,
                Classe: existingDaily.nameClass,
                bimestre: existingDaily.bimonthly
            });

            await Daily.deleteMany(filterRemove);
        }

        // IDs: usa antigos ou pega da turma
        const idRegentTeacher = oldIdRegentTeacher?.length > 0 ? oldIdRegentTeacher : (cla$$.classRegentTeacher || []).map(t => t._id);
        const idRegentTeacher02 = oldIdRegentTeacher02?.length > 0 ? oldIdRegentTeacher02 : (cla$$.classRegentTeacher02 || []).map(t => t._id);
        const idphysicalEducationTeacher = oldIdPhysicalEducationTeacher?.length > 0 ? oldIdPhysicalEducationTeacher : (cla$$.physicalEducationTeacher || []).map(t => t._id);

        // Pega os nomes da turma OU mantém antigos:
        const nameRegentTeacher = oldNameRegentTeacher || (cla$$.classRegentTeacher || []).map(t => t.name).join(', ') || "Professor não definido";
        const nameRegentTeacher02 = oldNameRegentTeacher02 || (cla$$.classRegentTeacher02 || []).map(t => t.name).join(', ') || "Professor não definido";
        const namephysicalEducationTeacher = oldNamePhysicalEducationTeacher || (cla$$.physicalEducationTeacher || []).map(t => t.name).join(', ') || "Professor não definido";

        const schoolNames = cla$$.id_school.name;

        //console.log("schoolNames", schoolNames)


        let bimonthly = null;

        if (id_iStQuarter) bimonthly = await I_stQuarter.findOne({ _id: id_iStQuarter });
        if (id_iiNdQuarter) bimonthly = await II_ndQuarter.findOne({ _id: id_iiNdQuarter });
        if (id_iiiRdQuarter) bimonthly = await III_rdQuarter.findOne({ _id: id_iiiRdQuarter });
        if (id_ivThQuarter) bimonthly = await IV_thQuarter.findOne({ _id: id_ivThQuarter });

        if (!bimonthly) return;

        //console.log("bimonthly", bimonthly)

        //const startDate = new Date(bimonthly.startyear, bimonthly.startmonth - 1, bimonthly.startday);
        //const endDate = new Date(bimonthly.endyear, bimonthly.endmonth - 1, bimonthly.endday, 23, 59, 59);
        const startDate = new Date(`${bimonthly.startyear}-${String(bimonthly.startmonth).padStart(2, '0')}-${String(bimonthly.startday).padStart(2, '0')}T00:00:00.000Z`);
        const endDate = new Date(`${bimonthly.endyear}-${String(bimonthly.endmonth).padStart(2, '0')}-${String(bimonthly.endday).padStart(2, '0')}T23:59:59.999Z`);

        const mongoose = require("mongoose");

        const attendance = await Attendance.aggregate([
            {
                $match: {
                    id_class: new mongoose.Types.ObjectId(idClass),
                    id_teacher: { $ne: physicalEducationTeacherId ? new mongoose.Types.ObjectId(physicalEducationTeacherId) : null }
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


        console.log("startDate", startDate.toISOString());
        console.log("endDate", endDate.toISOString());

        const recordClassTaught = await RecordClassTaught.aggregate([
            {
                $match: {
                    id_class: new mongoose.Types.ObjectId(idClass)
                }
            },
            {
                $addFields: {
                    dateOnly: {
                        $dateFromParts: {
                            year: { $toInt: "$year" },
                            month: { $toInt: "$month" },
                            day: { $toInt: "$day" }
                        }
                    }
                }
            },
            {
                $match: {
                    dateOnly: { $gte: startDate, $lte: endDate }
                }
            }
        ]);

        const filter = {
            id_class: idClass,
        };

        // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;

        let grades = [];

        if (filter.id_iStQuarter || filter.id_iiNdQuarter || filter.id_iiiRdQuarter || filter.id_ivThQuarter) {
            grades = await Concept.find(filter).populate('id_matter');
        }

        const individualForm = await IndividualForm.find(
            filter
        )

        const finalConcepts = await FinalConcepts.find({
            id_class: new mongoose.Types.ObjectId(idClass)
        });

        const daily = new Daily({
            nameRegentTeacher: nameRegentTeacher,
            nameSchool: schoolNames,
            year: year,
            nameClass: cla$$.serie,
            nameRegentTeacher02: nameRegentTeacher02,
            namephysicalEducationTeacher: namephysicalEducationTeacher,
            bimonthly: bimonthly.bimonthly,
            //totalGrade: bimonthly.totalGrade,
            //averageGrade: bimonthly.averageGrade,
            //idActivity: activities,
            //studentGrade: grades,
            studentConcept: grades,
            attendance: attendance,
            id_recordClassTaught: recordClassTaught,
            id_FinalConcepts: finalConcepts,
            id_individualForm: individualForm,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            idRegentTeacher: idRegentTeacher,
            idRegentTeacher02: idRegentTeacher02,
            idPhysicalEducationTeacher: idphysicalEducationTeacher,
            idClass: idClass,
            id_student: cla$$.id_student,
            transferStudents: cla$$.transferStudents
        });

        await daily.save();
        console.log("daily salvo:", daily);

        // Recarrega o documento com populate
        const populatedDaily = await Daily.findById(daily._id).populate("id_FinalConcepts");

        return res.status(201).json({
            msg: "Diário gerado com sucesso!",
            daily: populatedDaily
        });
    }

    async IndexDaily(req, res) {
        try {
            const {
                idClass,
                id_iStQuarter,
                id_iiNdQuarter,
                id_iiiRdQuarter,
                id_ivThQuarter,
            } = req.body.idClass;
            console.log(req.body)
            if (!idClass) return res.status(422).json({ msg: "O ID turma é obrigatório!" });
            // Filtro base
            const filter = {
                idClass: new mongoose.Types.ObjectId(idClass)
            };

            // Adiciona o bimestre ao filtro, se for informado
            if (id_iStQuarter) filter.id_iStQuarter = new mongoose.Types.ObjectId(id_iStQuarter);
            if (id_iiNdQuarter) filter.id_iiNdQuarter = new mongoose.Types.ObjectId(id_iiNdQuarter);
            if (id_iiiRdQuarter) filter.id_iiiRdQuarter = new mongoose.Types.ObjectId(id_iiiRdQuarter);
            if (id_ivThQuarter) filter.id_ivThQuarter = new mongoose.Types.ObjectId(id_ivThQuarter);

            const dailies = await Daily.find(filter)
                .populate({
                    path: 'idActivity',
                    populate: [
                        {
                            path: 'studentGrades',
                            model: 'numericalGrade',
                            populate: {
                                path: 'id_student',
                                model: 'student'
                            }
                        },
                        {
                            path: 'id_teacher',
                            model: 'employee'
                        },
                        {
                            path: 'id_matter',
                            model: 'matter'
                        }
                    ]
                })
                .populate({
                    path: 'studentGrade',
                    populate: [
                        {
                            path: 'id_matter',
                            model: 'matter',
                        },
                        {
                            path: 'id_student',
                            model: 'student',
                        },
                    ]
                })
                .populate({
                    path: 'studentConcept',
                    populate: [
                        {
                            path: 'id_matter',
                            model: 'matter',
                        },
                        {
                            path: 'id_student',
                            model: 'student',
                        },
                    ]
                })
                .populate('attendance')
                .populate({
                    path: 'id_recordClassTaught',
                    populate: {
                        path: 'id_teacher',
                        model: 'employee' // ou o nome correto do seu model de professor
                    }
                })
                .populate({
                    path: 'id_FinalConcepts',
                    populate: [
                        {
                            path: 'id_matter',
                            model: 'matter',
                        },
                        {
                            path: 'id_student',
                            model: 'student',
                        },
                    ]
                })
                .populate({
                    path: 'id_individualForm',
                    populate: [
                        {
                            path: 'id_student',
                            model: 'student',
                        },
                        {
                            path: 'id_teacher',
                            model: 'employee' // ou o nome correto do seu model de professor
                        },
                        {
                            path: 'id_teacher02',
                            model: 'employee' // ou o nome correto do seu model de professor
                        },

                    ]
                })
                .populate('id_student')
                .populate('transferStudents')

            if (!dailies || dailies.length === 0) {
                return res.status(404).json({ msg: "Nenhum diário encontrado para os critérios informados." });
            }

            return res.status(200).json({ dailies });

        } catch (error) {
            console.error("Erro ao buscar diário:", error);
            return res.status(500).json({ msg: "Erro interno do servidor." });
        }
    }

}

module.exports = new DailyController();