const mongoose = require("mongoose")

const schoolschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: {
                unique: true
            },
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true
        },
        avatar:{
            type: String,
            ref: 'PostFile',
        },
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        street: {
            type: String,
        },
        number: {
            type: String,
        },
        assessmentFormat: {
            type: String,
        },
        logo: {
            type: mongoose.Types.ObjectId,
            ref: 'FileLogo'
        },
        id_employee: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
        id_matter: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'matter'
            }
        ],
        id_class: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'class'
            }
        ],
        id_student: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'student'
            }
        ],
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
        status: {
            type: String,
            enum: ["active", "inactive"],
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("school", schoolschema);