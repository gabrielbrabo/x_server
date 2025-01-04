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
        /*cpf: {
            type: String,
            //unique: true
        },
        rg: {
            type: String,
        },*/
        cellPhone: {
            type: String,
        },
        cellPhoneOfParentsOrGuardians: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
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
        id_responsible: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Responsible_for_the_student'
            }
        ],
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
        id_reporter_card: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'reporter_card'
            }
        ],
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
        status: {
            type: String,
            enum: ["active", "inactive"],
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("student", studentschema);