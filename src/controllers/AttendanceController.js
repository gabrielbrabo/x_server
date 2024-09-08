const Attendance = require("../models/Attendance")
const Student = require( "../models/Student")

class AttendanceController {

    async createAttendance(req, res) {
        const { day, month, year, status, id_student, id_teacher, id_matter, id_class } = req.body;

        // validations
        if (!day) {
            return res.status(422).json({ msg: "O Dia é obrigatório!" });
        }

        if (!month) {
            return res.status(422).json({ msg: "O Mes é obrigatório!" });
        }

        if (!year) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }

        if (!status) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }
        const user = new Attendance({
            day: day,
            month: month,
            year: year,
            status: status.toUpperCase(),
            id_student: id_student,
            id_teacher: id_teacher,
            id_matter: id_matter,
            id_class: id_class
        });

        try {
            
            const attendance = await user.save()
            
            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_attendance: attendance._id      
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

    async index(req, res) {

        const { day, month, year, id_matter, id_class } = req.body;

        const attendance = await Attendance.find({ id_class: id_class }).populate('id_student');

        const att = attendance.map(res => {
            if (res.id_matter == id_matter) {
                if (res.year == year) {
                    if (res.month == month) {
                        if (res.day == day) {
                            return res
                        }
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })

        try {
            if (att) {
                return res.json({
                    data: att,
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

module.exports = new AttendanceController();