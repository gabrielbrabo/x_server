const mongoose = require("mongoose")

const attendance = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
        },
        month: {
            type: Object,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        date: {
            type: Date, // Campo adicional para armazenar a data combinada
            //required: true, // Agora é obrigatório
        },
        status: {
            type: String,
            required: true,
        },
        id_student: {
            type: mongoose.Types.ObjectId,
            ref: 'student',
        },
        id_teacher: {
            type: mongoose.Types.ObjectId,
            ref: 'employee',
        },
        id_teacher02: {
            type: mongoose.Types.ObjectId,
            ref: 'employee'
        },
        id_class: {
            type: mongoose.Types.ObjectId,
            ref: 'class',
        },
        isPhysicalEducation: { type: Boolean, default: false }, // novo campo

    },
    {
        timestamps: true
    }
);

// Middleware para preencher `date` ao salvar um único documento
attendance.pre('save', function (next) {
    if (this.day && this.month && this.year) {
        this.date = new Date(`${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`);
    }
    next();
});

// Middleware para preencher `date` ao usar `insertMany`
attendance.pre('insertMany', function (next, docs) {
    docs.forEach(doc => {
        if (doc.day && doc.month && doc.year) {
            doc.date = new Date(`${doc.year}-${String(doc.month).padStart(2, '0')}-${String(doc.day).padStart(2, '0')}`);
        }
    });
    next();
});

module.exports = mongoose.model("attendance", attendance);