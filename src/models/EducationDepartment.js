const mongoose = require("mongoose")

const educationDepartmentSchema = new mongoose.Schema(
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
        type: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            ref: 'PostFile',
        },
        municipality: {
            type: String,
        },
        state: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        logo: {
            type: mongoose.Types.ObjectId,
            ref: 'FileLogo'
        },
        id_employee: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employeeEducationDepartment'
            }
        ],
        id_school: {
            type: mongoose.Types.ObjectId,
            ref: 'school',
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

module.exports = mongoose.model("education-department", educationDepartmentSchema);