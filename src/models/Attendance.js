const mongoose = require("mongoose")

const attendance = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
        },
        month: {
            type: Object,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        id_student: {
            type: mongoose.Types.ObjectId, 
            ref: 'student',
        },
        id_teacher: {
            type: mongoose.Types.ObjectId, 
            ref: 'employee',
        },
        id_class: {
            type: mongoose.Types.ObjectId, 
            ref: 'class',
        },
        
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("attendance", attendance);