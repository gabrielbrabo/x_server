const mongoose = require("mongoose")

const V_thQuarter = new mongoose.Schema(
    {
       
        year: {
            type: String,
            required: true,
        },
        bimonthly: {
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
            //required: true,
        },
        averageGrade: {
            type: String,
            //required: true,
        },
        status: {
            type: String,
        },
        statusSupervisor: {
            type: String,
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

module.exports = mongoose.model("V_thQuarter", V_thQuarter);