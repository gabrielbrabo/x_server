const mongoose = require("mongoose")

const classschema = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true,
        },
        serie: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
        },
        shift: {
            type: String,
            required: true,
        },
        classroom_number: {
            type: String,
            required: true,
        },
        id_school: {
            type: mongoose.Types.ObjectId, 
            ref: 'school',
        },
        id_student: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'student'
            }
        ],
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
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("class", classschema);