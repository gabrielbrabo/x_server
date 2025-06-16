const mongoose = require("mongoose")

const report_cardschema = new mongoose.Schema(
    {
        nameStudent: {
            type: String,
            required: true,
        },
        nameTeacher: {
            type: String,
            required: true,
        },
        nameSchool: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        bimonthly: {
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
        studentGrade: {
            type: Map,
            of: Number,
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
        frequencia: {
            totalAulas: { type: Number },
            totalPresencas: { type: Number },
            totalFaltas: { type: Number },
            totalFaltasJustificadas: { type: Number },
            percentualPresenca: { type: String },
            percentualFaltas: { type: String },
            percentualFaltasJustificadas: { type: String },
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
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("report_card", report_cardschema);