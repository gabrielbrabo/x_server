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
        rg: {
            type: String,
            unique: true
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
        id_class: {
            type: mongoose.Types.ObjectId,
            ref: 'class'
        },           
        id_reporter_card: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'reporter_card'
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