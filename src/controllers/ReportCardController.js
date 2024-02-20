const Employee = require( "../models/Employee")
const Student = require( "../models/Student")
const Cards = require( "../models/Report_card")
const Matter = require( "../models/Matter")

class StudentController {
  
    async create(req, res) {
        const { year, id_matter, id_employee, id_student } = req.body;

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
            
            const Res = card.map( result => {
                if(result.year == year) {
                    return result.id_matter
                }
            })

            const mttr = Res.map( result => {
                if(result == id_matter) {
                    return result
                }
            }).filter((fill) => {
                return fill
            })
            console.log("filter", mttr)
            if(mttr.length > 0) {    
                return res.status(422).json({mttr, msg: "Essa truma ja esta cadastrada!" });
            }
        }

        // create user
        const newreportCards = new Cards({
            year: year, 
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

        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

}
  
module.exports = new StudentController();