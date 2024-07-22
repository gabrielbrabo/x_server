const Attendance = require("../models/Attendance")

class AttendanceController {
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