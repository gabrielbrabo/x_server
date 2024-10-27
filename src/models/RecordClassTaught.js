const mongoose = require("mongoose")

const RecordClassTaught = new mongoose.Schema(
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
        description: {
            type: String,
            required: true,
        },
        id_teacher: {
            type: mongoose.Types.ObjectId,
            ref: 'employee',
        },
        id_class: {
            type: mongoose.Types.ObjectId,
            ref: 'class'
        },
    },
    {
        timestamps: true
    }
);

// Hook para calcular e preencher o campo `date` automaticamente antes de salvar
RecordClassTaught.pre('save', function (next) {
    // Converte os campos `day`, `month`, e `year` para um objeto de data
    if (this.day && this.month && this.year) {
        this.date = new Date(this.year, this.month - 1, this.day); // Mês é 0-based em JavaScript
    }
    next();
});

module.exports = mongoose.model("RecordClassTaught", RecordClassTaught);