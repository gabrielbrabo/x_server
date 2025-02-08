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

        const att = await Attendance.find({id_student: id_student})
        
       // console.log("att", att)
        const resAtt = att.map( res => {
            if(res.day === day) {
                if (res.month === month) {
                    if(res.year === year) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("resAtt", resAtt)
        if(resAtt.length > 0) {
            return res.status(422).json({ msg: "frequencia ja adicionada" });
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
        
        const { day, month, year, id_class, id_teacher } = req.body.month;
        //console.log("Body recebido pelo backend:", req.body);
        //console.log("Tipo de id_teacher:", typeof req.body.id_teacher);
        const attendance = await Attendance.find({ id_teacher: id_teacher }).populate('id_student');
        //console.log("attendance", attendance)
        const att = attendance.map(res => {
            if (res.year == year) {
                if (res.month == month) {
                    if (res.day == day) {
                        if (res.id_class == id_class) {
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

    async AttendanceBimonthly(req, res) {
        const { startd, startm, starty, endd, endm, endy, id_student, id_teacher } = req.body;

        try {
            // Converta as partes da data para números inteiros
            const startDay = parseInt(startd, 10);
            const startMonth = parseInt(startm, 10);
            const startYear = parseInt(starty, 10);
            const endDay = parseInt(endd, 10);
            const endMonth = parseInt(endm, 10);
            const endYear = parseInt(endy, 10);

            // Converta para objetos de data
            const startDate = new Date(Date.UTC(startYear, startMonth - 1, startDay)); // Normaliza para UTC
            const endDate = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59)); // Inclui o fim do dia em UTC

            // Busque as presenças que estão entre essas datas
            const attendance = await Attendance.find({
                id_student: id_student,
                id_teacher: id_teacher,
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

    async AttendanceFinalConcepts(req, res) {

        const { year, id_student, id_teacher } = req.body;
        console.log('dados recebidos', year, id_student, id_teacher)
        const attendance = await Attendance.find({
            id_student: id_student,
            id_teacher: id_teacher
        }).populate('id_student')

        const att = attendance.map(res => {
            if (res.year == year) {
                return res
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        //console.log("grade", attendance)
        //console.log("grd", att)
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

    async AttendanceByTeacherAndClass(req, res) {
        const { year, id_teacher, id_class, startd, startm, starty, endd, endm, endy } = req.body;
        console.log('dados recebidos', year, id_teacher, id_class, startd, startm, starty, endd, endm, endy)
        try {
            // Converta as partes da data para números inteiros
            const startDay = parseInt(startd, 10);
            const startMonth = parseInt(startm, 10);
            const startYear = parseInt(starty, 10);
            const endDay = parseInt(endd, 10);
            const endMonth = parseInt(endm, 10);
            const endYear = parseInt(endy, 10);

            // Converta para objetos de data
            const startDate = new Date(Date.UTC(startYear, startMonth - 1, startDay)); // Normaliza para UTC
            const endDate = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59)); // Inclui o fim do dia em UTC

            console.log('startDate', startDate, 'endDate', endDate)
            // Busque as presenças que correspondem aos critérios
            const attendance = await Attendance.find({
                year: year,
                id_teacher: id_teacher,
                id_class: id_class,
                date: {
                    $gte: startDate, // Maior ou igual à data de início
                    $lte: endDate    // Menor ou igual à data de fim
                }
            }).populate('id_teacher id_class id_student');

            console.log("attendance", attendance);

            if (attendance.length > 0) {
                return res.json({
                    data: attendance,
                    message: 'Success'
                });
            } else {
                return res.status(404).json({
                    message: 'No attendance records found for the specified criteria.'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }

    async DestroyAttendance(req, res) {
        const { idAttendance } = req.body;
        console.log("req.body", req.body)
        // validations
        if (!idAttendance) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }

        /*if (!id_employee) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }*/

        // Check if the student is already registered in a class
        const attendance = await Attendance.findOne({
            _id: idAttendance
        }).populate('id_student')

        const idStudent = attendance.id_student._id
        
        console.log("attendance",attendance)
        console.log("idStudent",idStudent)

        try {

            await attendance.deleteOne()

            await Student.updateMany({
                _id: idStudent
            }, {
                $pull: {
                    id_attendance: idAttendance   
                }
            })
            res.status(200).json({
                msg: 'Materia removido com sucesso.'
            })
        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }
}

module.exports = new AttendanceController();