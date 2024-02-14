const mongoose = require("mongoose")

const report_cardschema = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true,
        },
        I_st_quarter: {
            type: String,
        },
        II_nd_quarter: {
            type: String,
        },
        III_rd_quarter: {
            type: String,
        },
        IV_th_quarter: {
            type: String,
        },
        id_matter: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'matter'
            }
        ],
        id_student: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'student'
            }
        ],
        id_employee: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("report_card", report_cardschema);