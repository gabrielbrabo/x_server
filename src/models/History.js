const mongoose = require("mongoose")

const historyschema = new mongoose.Schema(
    {
        nameStudent: {
            type: String,
            required: true,
        },
        nameTeacher: {
            type: String,
            //required: true,
        },
        nameSchool: {
            type: String,
            required: true,
        },
        municipality: {
            type: String,
        },
        state: {
            type: String,
        },
        year: {
            type: String,
            required: true,
        },
        dailyWorkload: {
            type: String,
            required: true,
        },
        extraWorkingHours: {
            type: String,
        },
        absencesOvertime: {
            type: String,
        },
        extraSubjects: [
            {
                name: {
                    type: String,
                },
                grade: {
                    type: String,
                }
            }
        ],          
        studentSituation: {
            type: String,
        },
        annualSchoolDays: {
            type: String,
            required: true,
        },
        serie: {
            type: String,
        },
        nameClass: {
            type: String,
        },
        totalGrade: {
            type: String,
            //required: true,
        },
        averageGrade: {
            type: String,
            //required: true,
        },
        reportCard: {
            type: [mongoose.Schema.Types.Mixed], // aceita qualquer estrutura de objeto
            default: [],
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
        id_student: {
            type: mongoose.Types.ObjectId,
            ref: 'student'
        },
        idTeacher: {
            type: mongoose.Types.ObjectId,
            ref: 'employee'
        },
        idClass: {
            type: mongoose.Types.ObjectId,
            ref: 'class'
        },
        id_school: {
            type: mongoose.Types.ObjectId,
            ref: 'school'
        },
        createdManually: {
            type: Boolean,
            default: false
        }        
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("history_card", historyschema);