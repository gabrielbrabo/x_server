const Attendance = require("../models/Attendance")
const Student = require("../models/Student")

class AttendanceController {

    async createAttendance(req, res) {
        const { day, month, year, status, id_student, id_teacher, id_class } = req.body;

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

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async index(req, res) {

        const { day, month, year, id_class } = req.body;

        const attendance = await Attendance.find({ id_class: id_class }).populate('id_student');

        const att = attendance.map(res => {
            if (res.year == year) {
                if (res.month == month) {
                    if (res.day == day) {
                        return res
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

    async AttendanceBimonthly(req, res) {
        const { startd, startm, starty, endd, endm, endy, id_student } = req.body;

        try {
            // Converta as partes da data para números inteiros
            const startDay = parseInt(startd, 10);
            const startMonth = parseInt(startm, 10);
            const startYear = parseInt(starty, 10);
            const endDay = parseInt(endd, 10);
            const endMonth = parseInt(endm, 10);
            const endYear = parseInt(endy, 10);

            // Converta para objetos de data
            const startDate = new Date(startYear, startMonth - 1, startDay); // Mês é 0-based em JS
            const endDate = new Date(endYear, endMonth - 1, endDay);

            // Busque as presenças que estão entre essas datas
            const attendance = await Attendance.find({
                id_student: id_student,
                // Comparar diretamente com as datas de início e fim
                date: {
                    $gte: startDate, // Maior ou igual à data de início
                    $lte: endDate    // Menor ou igual à data de fim
                }
            }).populate('id_student');

            console.log("attendance", attendance);

            if (attendance.length > 0) {
                return res.json({
                    data: attendance,
                    message: 'Success'
                });
            } else {
                return res.status(404).json({
                    message: 'No attendance records found for the specified period.'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
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