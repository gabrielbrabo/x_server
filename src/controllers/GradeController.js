const Grade = require("../models/Grade")
const Student = require( "../models/Student")

class GradeController {

    async createGrade(req, res) {
        const { year, bimonthly, totalGrade, averageGrade, studentGrade, id_iStQuarter, id_iiNdQuarter, id_iiiRdQuarter, id_ivThQuarter, id_student, id_teacher, id_matter } = req.body;

        // validations
        if (!totalGrade) {
            return res.status(422).json({ msg: "O Dia é obrigatório!" });
        }

        if (!averageGrade) {
            return res.status(422).json({ msg: "O Mes é obrigatório!" });
        }

        if (!year) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }
        if (!studentGrade) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }

        const user = new Grade({
            year: year,
            bimonthly: bimonthly.toUpperCase(),
            totalGrade: totalGrade,
            averageGrade: averageGrade,
            studentGrade: studentGrade,
            status: 'ABERTO',
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            id_student: id_student,
            id_teacher: id_teacher,
            id_matter: id_matter
        });

        try {
            
            const grade = await user.save()
            
            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_grade: grade._id      
                }
            })
            res.status(200).json({
                msg: 'Conta profissional cadastrado com sucesso.'
            })

        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async indexIstQuarter(req, res) {

        const { year, id_matter, id_iStQuarter} = req.body;

        const grade = await Grade.find({ id_iStQuarter: id_iStQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    return res
                } 
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
       console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

        const { update_attendance, update_status } = req.body;

        const attendance = await Attendance.findByIdAndUpdate(update_attendance, { status: update_status }, { new: true });

        try {
            if (!attendance) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json(attendance);
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }
}

module.exports = new GradeController();