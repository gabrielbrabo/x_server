const mongoose = require("mongoose");

const employeesEducationDepartmentchema = new mongoose.Schema(
    {
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
        positionAtEducationDepartment: {
            type: String,
            required: true,
        },
        idEducationDepartment: {
            type: mongoose.Types.ObjectId,
            ref: 'education-department',
            required: true,
        },
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

// Índice composto para garantir unicidade do par cpf + idEducationDepartment
employeesEducationDepartmentchema.index({ cpf: 1, idEducationDepartment: 1 }, { unique: true });

module.exports = mongoose.model("employeeEducationDepartment", employeesEducationDepartmentchema);
