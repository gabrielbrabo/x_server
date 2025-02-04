const mongoose = require("mongoose")

const matterschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        id_school: {
            type: mongoose.Types.ObjectId, 
            ref: 'school',
            required: true,
        },
        /*id_employee: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],*/
        /*id_class: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'class'
            }
        ],*/
        /*id_reporter_card: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'reporter_card'
            }
        ],*/
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("matter", matterschema);