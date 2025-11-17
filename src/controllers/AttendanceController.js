const Attendance = require("../models/Attendance")
const testAttendance = require("../models/TestAttendance")
const Student = require("../models/Student")

const mongoose = require('mongoose');

class AttendanceController {

    async createAttendance(req, res) {
        const attendances = req.body; // Recebe um array de frequências

        if (!Array.isArray(attendances)) {
            return res.status(400).json({ error: 'O corpo da requisição deve ser um array.' });
        }

        try {
            console.log("attendances", attendances);

            // --- VALIDA E CORRIGE CADA FREQUÊNCIA ---
            const preparedAttendances = attendances.map((att) => {
                const year = parseInt(att.year);
                const month = parseInt(att.month);
                const day = parseInt(att.day);

                // validação forte
                if (
                    !year || year < 1900 || year > 2100 ||
                    !month || month < 1 || month > 12 ||
                    !day || day < 1 || day > 31
                ) {
                    throw new Error(`Data inválida: ${att.year}-${att.month}-${att.day}`);
                }

                const date = new Date(year, month - 1, day);

                return {
                    ...att,
                    year,
                    month,
                    day,
                    date,
                };
            });

            // --- INSERE NO BANCO ---
            const insertedAttendances = await Attendance.insertMany(preparedAttendances);

            // --- RELACIONA COM O STUDENT ---
            await Promise.all(insertedAttendances.map(async (attendance) => {
                await Student.updateOne(
                    { _id: attendance.id_student },
                    { $push: { id_attendance: attendance._id } }
                );
            }));

            res.status(200).json({
                msg: 'Frequências salvas e vinculadas aos estudantes com sucesso!'
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message || 'Erro ao salvar as frequências' });
        }
    }

    // Rota para salvar a frequência dos alunos
    async testcreateArrayAttendance(req, res) {

        const attendances = req.body; // Recebe um array de frequências

        // validations
        if (!Array.isArray(attendances)) {
            return res.status(400).json({ error: 'O corpo da requisição deve ser um array.' });
        }

        try {

            console.log("attendances", attendances)

            await testAttendance.insertMany(attendances);
            res.status(200).json({ msg: 'Frequências salvas com sucesso!' });

        } catch (err) {
            res.status(500).json({ error: 'Erro ao salvar as frequências' });
        }
    }

    async index(req, res) {

        const { day, month, year, id_class, id_teacher } = req.body;
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

    async indexAllAttendance(req, res) {
        try {
            const { id_class } = req.body//.id_class; // ou req.params.id_class
            console.log("🔎 ID recebido:", req.body);

            // Converter para ObjectId
            const classId = new mongoose.Types.ObjectId(id_class);

            // Buscar registros de presença da turma
            const attendance = await Attendance.find({ id_class: classId })
            //.populate('id_student');

            console.log("📌 Resultado da query:", attendance);

            if (!attendance || attendance.length === 0) {
                return res.status(404).json({
                    message: "Nenhum registro de chamada encontrado para esta turma."
                });
            }

            return res.json({
                data: attendance,
                message: 'Success'
            });

        } catch (err) {
            console.error("❌ Erro no indexAllAttendance:", err);
            return res.status(500).json({
                message: 'There was an error on server side!'
            });
        }
    }

    async testindex(req, res) {

        const { day, month, year, id_class, id_teacher } = req.body;
        console.log("Body recebido pelo backend:", req.body);
        //console.log("Tipo de id_teacher:", typeof req.body.id_teacher);
        const attendance = await testAttendance.find({ id_teacher: id_teacher }).populate('id_student');
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

    async destroyArrayAttendance(req, res) {

        const idAttendances = req.body; // Recebe um array de frequências

        // validations
        if (!Array.isArray(idAttendances)) {
            return res.status(400).json({ error: 'O corpo da requisição deve ser um array.' });
        }

        try {

            console.log("attendances", idAttendances)

            // Remove todos os documentos cujos _id estão na lista
            await testAttendance.deleteMany({ _id: { $in: idAttendances } });

            res.status(200).json({ msg: 'Frequências removidas com sucesso!' });

        } catch (err) {
            res.status(500).json({ error: 'Erro ao salvar as frequências' });
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
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('id_student');

            console.log("attendance", attendance);

            console.log("id_teacher req:", typeof id_teacher, id_teacher);
            console.log("id_teacher DB:", attendance[0]?.id_teacher);


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
        const idAttendances = req.body; // Recebe um array de IDs de frequências a serem removidas

        // Validations
        if (!Array.isArray(idAttendances)) {
            return res.status(400).json({ error: 'O corpo da requisição deve ser um array.' });
        }

        try {
            console.log("attendances to remove", idAttendances);

            // Remove todas as chamadas cujos _id estão na lista recebida
            await Attendance.deleteMany({ _id: { $in: idAttendances } });

            // Atualiza os estudantes, removendo os _id deletados do array id_attendance
            await Student.updateMany(
                { id_attendance: { $in: idAttendances } },
                { $pull: { id_attendance: { $in: idAttendances } } }
            );

            res.status(200).json({ msg: 'Frequências removidas e estudantes atualizados com sucesso!' });

        } catch (err) {
            res.status(500).json({ error: 'Erro ao remover as frequências' });
        }

    }
}

module.exports = new AttendanceController();