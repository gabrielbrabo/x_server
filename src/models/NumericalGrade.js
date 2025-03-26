const mongoose = require("mongoose")

const numericalGrade_schema = new mongoose.Schema(
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
            //required: true,
        },
        averageGrade: {
            type: String,
            //required: true,
        },
        studentGrade: {
            type: String,
            //required: true,
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
        id_vThQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'V_thQuarter'
        },
        id_viThQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'VI_thQuarter'
        },
        id_matter: {
            type: mongoose.Types.ObjectId,
            ref: 'matter'
        },
        id_student: {
            type: mongoose.Types.ObjectId,
            ref: 'student'
        },
        idActivity: {
            type: mongoose.Types.ObjectId,
            ref: 'Activity'
        },
        id_teacher: {
            type: mongoose.Types.ObjectId,
            ref: 'employee'
        },
        id_teacher02: {
            type: mongoose.Types.ObjectId,
            ref: 'employee'
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

module.exports = mongoose.model("numericalGrade", numericalGrade_schema);