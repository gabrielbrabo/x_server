const Student = require("../models/Student")
const FinalConcepts = require("../models/FinalConcepts")

class finalConcepts {

    async create(req, res) {
        const { year, studentGrade, id_matter, id_employee, id_student, id_class } = req.body;

        console.log("Requisição recebida com dados:", { year, studentGrade, id_matter, id_employee, id_student });

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

        const card = await FinalConcepts.find({ _id: student.id_FinalConcepts });

        if (card) {

            const Res = card.map(result => {
                if (result.year == year) {
                    if (result.id_matter == id_matter) {
                        return result
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
        const newFinalConcepts = new FinalConcepts({
            year: year,
            studentGrade: studentGrade.toUpperCase(),
            id_matter: id_matter,
            id_class: id_class,
            id_employee: id_employee,
            id_student: id_student
        })

        try {

            const finalConcepts = await newFinalConcepts.save()

            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_FinalConcepts: finalConcepts._id
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

    async GetGradeFinalConcepts(req, res) {

        const { year, id_matter } = req.body;
        console.log("Requisição recebida com dados:", { year, id_matter });

        const finalconcepts = await FinalConcepts.find({
            id_matter: id_matter
        }).populate('id_student').populate('id_matter').populate('id_employee')

        const concepts = finalconcepts.map(res => {
            if (res.year == year) {
                return res
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grade", finalconcepts)
        console.log("grd", concepts)
        try {
            if (concepts) {
                return res.json({
                    data: concepts,
                    message: 'Sucess'
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async update(req, res) {

        const { update_id_grade, update_studentGrade } = req.body;

        const grade = await FinalConcepts.findByIdAndUpdate(update_id_grade, { studentGrade: update_studentGrade }, { new: true });

        try {
            if (!grade) {
                return res.status(404).json({ message: 'Student Grade not found' });
            }
            res.json(grade);
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async GetFinalConcepts(req, res) {

        const { year, id_student } = req.body;

        const gradefinal = await FinalConcepts.find({
            id_student: id_student
        }).populate('id_student').populate('id_matter').populate('id_employee')

        const grade = gradefinal.map(res => {
            if (res.year == year) {
                return res
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grade", grade)
        console.log("grd", gradefinal)
        try {
            if (grade) {
                return res.json({
                    data: grade,
                    message: 'Sucess'
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }
    async FinalConceptsDaily(req, res) {

        const { year, id_class } = req.body;
        console.log("dados do front", req.body)

        const gradefinal = await FinalConcepts.find({
            id_class: id_class
        }).populate('id_student').populate('id_matter').populate('id_employee')

        const grade = gradefinal.map(res => {
            if (res.year == year) {
                return res
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grade", grade)
        console.log("grd", gradefinal)
        try {
            if (grade) {
                return res.json({
                    data: grade,
                    message: 'Sucess'
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

}

module.exports = new finalConcepts();