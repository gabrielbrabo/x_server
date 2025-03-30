const mongoose = require("mongoose")

const studentschema = new mongoose.Schema(
    {
        registerStudent: {
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
        race: {
            type: String,
        },
        sex: {
            type: String,
        },
        admissionDate: {
            type: String,
        },
        entryDate: {
            type: String,
        },
        departureDate: {
            type: String,
        },
        /*cpf: {
            type: String,
            //unique: true
        },
        rg: {
            type: String,
        },*/
        motherName: {
            type: String,
        },
        fatherName: {
            type: String,
        },
        fatherCellPhone: {
            type: String,
        },
        motherCellPhone: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        type: {
            type: String,
        },
        password: {
            type: String,
        },
        avatar:{
            type: String,
            ref: 'PostFile',
        },
        id_school: {
            type: mongoose.Types.ObjectId, 
            ref: 'school',
            required: true,
        },
        /*id_responsible: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Responsible_for_the_student'
            }
        ],*/
        id_class: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'class'
            }
        ],         
        id_attendance: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'attendance'
            }
        ], 
        id_grade: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'grade'
            }
        ],        
        numericalGrades: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'numericalGrade'
            }
        ],        
        /*id_reporter_card: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'reporter_card'
            }
        ],*/
        id_FinalConcepts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'FinalConcepts'
            }
        ],
        id_individualForm: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'IndividualForm'
            }
        ],
        status: { type: String, enum: ["ativo", "transferido", "inativo"], default: "ativo" }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("student", studentschema);