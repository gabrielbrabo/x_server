const mongoose = require("mongoose")

const testattendance = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
        },
        month: {
            type: Number,
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
        id_class: {
            type: mongoose.Types.ObjectId,
            ref: 'class',
        },

    },
    {
        timestamps: true
    }
);

// Middleware para preencher `date` ao salvar um único documento
testattendance.pre('save', function (next) {
    if (this.day && this.month && this.year) {
        this.date = new Date(`${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`);
    }
    next();
});

// Middleware para preencher `date` ao usar `insertMany`
testattendance.pre('insertMany', function (next, docs) {
    docs.forEach(doc => {
        if (doc.day && doc.month && doc.year) {
            doc.date = new Date(`${doc.year}-${String(doc.month).padStart(2, '0')}-${String(doc.day).padStart(2, '0')}`);
        }
    });
    next();
});

module.exports = mongoose.model("testattendance", testattendance);