/*const mongoose = require("mongoose")

const addTeacherschema = new mongoose.Schema(
    {
        name_teacher: {
            type: String,
            required: true,
        },
        name_matter: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        id_class: {
            type: mongoose.Types.ObjectId, 
            ref: 'class',
        },
        id_teacher: {
            type: mongoose.Types.ObjectId, 
            ref: 'employee',
        },
        id_matter: {
            type: mongoose.Types.ObjectId, 
            ref: 'matter',
        },
        
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("addTeacher", addTeacherschema);*/