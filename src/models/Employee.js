const mongoose = require("mongoose");

const employeeschema = new mongoose.Schema(
    {
        EmployeeCode: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        cpf: {
            type: String,
            required: true,
        },
        rg: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        cellPhone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            ref: 'PostFile',
        },
        type: {
            type: String,
            required: true,
        },
        position_at_school: {
            type: String,
            required: true,
        },
        id_school: {
            type: mongoose.Types.ObjectId,
            ref: 'school',
            required: true,
        },
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
        id_recordClassTaught: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'RecordClassTaught'
            }
        ],
        status: {
            type: String,
            enum: ["active", "inactive"],
        },
        resetToken: String,
        resetTokenExpiry: Date,
    },
    {
        timestamps: true
    }
);

// Índice composto para garantir unicidade do par cpf + id_school
employeeschema.index({ cpf: 1, id_school: 1 }, { unique: true });

module.exports = mongoose.model("employee", employeeschema);
