const mongoose = require("mongoose")

const Responsible_for_the_studentschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        cpf: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        id_student: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'student'
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

module.exports = mongoose.model("Responsible_for_the_student", Responsible_for_the_studentschema);