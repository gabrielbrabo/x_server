const mongoose = require("mongoose")

const employeeschema = new mongoose.Schema(
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
            unique: true
        },
        rg: {
            type: String,
            required: true,
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
        avatar:{
            type: String,
            ref: 'PostFile',
        },
        type: {
            type: String,
            required: true
        },
        position_at_school: {
            type: String,
            required: true
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

module.exports = mongoose.model("employee", employeeschema);