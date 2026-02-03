const mongoose = require("mongoose")

const IV_thQuarter = new mongoose.Schema(
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
        // 👇 DIAS LETIVOS (DATA POR DATA)
        schoolDays: [
            {
                date: {
                    type: Date,
                    required: true
                }
            }
        ],
        totalGrade: {
            type: Number,
            //required: true,
        },
        averageGrade: {
            type: Number,
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
        assessmentRegime: {
            type: String,
            enum: ['BIMESTRAL', 'TRIMESTRAL', 'SEMESTRAL']
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("IV_thQuarter", IV_thQuarter);