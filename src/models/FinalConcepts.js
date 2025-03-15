const mongoose = require("mongoose")

const FinalConcepts = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true,
        },
        studentGrade: {
            type: String,
            required: true,
        },
        status: {
            type: String,
        },
        id_matter: {
            type: mongoose.Types.ObjectId,
            ref: 'matter'
        },
        id_student: {
            type: mongoose.Types.ObjectId,
            ref: 'student'
        },
        id_class: {
            type: mongoose.Types.ObjectId, 
            ref: 'class',
        },
        id_employee: {
            type: mongoose.Types.ObjectId,
            ref: 'employee'
        },
        id_teacher02: {
            type: mongoose.Types.ObjectId,
            ref: 'employee'
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FinalConcepts", FinalConcepts);