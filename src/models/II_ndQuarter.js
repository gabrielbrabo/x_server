const mongoose = require("mongoose")

const II_ndQuarter = new mongoose.Schema(
    {
       
        year: {
            type: String,
            required: true,
        },
        startday: {
            type: String,
            required: true,
        },
        startmonth: {
            type: String,
            required: true,
        },
        startyear: {
            type: String,
            required: true,
        },
        endday: {
            type: String,
            required: true,
        },
        endmonth: {
            type: String,
            required: true,
        },
        endyear: {
            type: String,
            required: true,
        },
        totalGrade: {
            type: String,
            required: true,
        },
        averageGrade: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        id_reporter_card: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'reporter_card'
            }
        ],
        id_school: {
            type: mongoose.Types.ObjectId, 
            ref: 'school',
            required: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("II_ndQuarter", II_ndQuarter);