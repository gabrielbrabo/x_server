/*const mongoose = require("mongoose")

const report_cardschema = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true,
        },
        bimonthly: {
            type: String,
        },
        totalGrade: {
            type: String,
            required: true,
        },
        averageGrade: {
            type: String,
            required: true,
        },
        studentGrade: {
            type: String,
            required: true,
        },
        idBimonthly: {
            type: String,
            required: true,
        },
        status: {
            type: String,
        },
        id_iStQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'I_stQuarter'
        },
        id_iiNdQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'II_ndQuarter'
        },
        id_iiiRdQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'III_rdQuarter'
        },
        id_ivThQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'IV_thQuarter'
        },
        id_attendance: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'attendance'
            }
        ],
        id_matter: {
            type: mongoose.Types.ObjectId,
            ref: 'matter'
        },
        id_student: {
            type: mongoose.Types.ObjectId,
            ref: 'student'
        },
        id_employee: {
            type: mongoose.Types.ObjectId,
            ref: 'employee'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("report_card", report_cardschema);*/