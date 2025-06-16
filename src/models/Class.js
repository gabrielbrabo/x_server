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
        transferStudents: [
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
        classRegentTeacher: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
        classRegentTeacher02: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
        physicalEducationTeacher: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
        addTeacher: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'addTeacher'
            }
        ],
        id_matter: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'matter'
            }
        ],
        dailyStatus: {
            type: Object,
            default: {
                "1º BIMESTRE": {
                    regentTeacher: "aberto",
                    physicalEducationTeacher: "aberto"
                },
                "2º BIMESTRE": {
                    regentTeacher: "aberto",
                    physicalEducationTeacher: "aberto"
                },
                "3º BIMESTRE": {
                    regentTeacher: "aberto",
                    physicalEducationTeacher: "aberto"
                },
                "4º BIMESTRE": {
                    regentTeacher: "aberto",
                    physicalEducationTeacher: "aberto"
                }
            }
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("class", classschema);