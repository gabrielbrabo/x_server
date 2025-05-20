const Employee = require("../models/Employee")
const Student = require("../models/Student")
const Cards = require("../models/Report_card")
const Matter = require("../models/Matter")
const NumericalGrade = require("../models/NumericalGrade")

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

    async allTheBulletins(req, res) {
        const {
            idClass,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
        } = req.body;

        const cla$$ = await Class.findOne({ _id: idClass }).populate('id_student')


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

                // Filtrar pelo bimestre específico
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

                return {
                    id: aluno._id,
                    nome: aluno.name,
                    totalPorMateria,
                };
            })
        );

        console.log("resultados", bimonthly)
        console.log('Filtro inicial:', filter);
        //console.log('cla$$:', cla$$);
        console.log(JSON.stringify(boletins, null, 2));

    }

}

module.exports = new RepoCardController();