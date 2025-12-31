const mongoose = require("mongoose")

const Dailyschema = new mongoose.Schema(
    {

        nameRegentTeacher: {
            type: String,
            required: true,
        },
        nameRegentTeacher02: {
            type: String,
        },
        namephysicalEducationTeacher: {
            type: String,
        
        },
        nameSchool: {
            type: String,
            required: true,
        },
        serie: {
            type: String,
            required: true,
        },
        nameClass: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        bimonthly: {
            type: String,
        },
        totalGrade: {
            type: String,
        },
        averageGrade: {
            type: String,
        },
        idActivity: [{
            type: mongoose.Types.ObjectId,
            ref: 'Activity'
        }],
        studentGrade: [{
            type: mongoose.Types.ObjectId,
            ref: 'numericalGrade'
        }],
        studentConcept: [{
            type: mongoose.Types.ObjectId,
            ref: 'grade'
        }],
        attendance: [{
            type: mongoose.Types.ObjectId,
            ref: 'attendance'
        }],
        attendancePhysicalEducationTeacher: [{
            type: mongoose.Types.ObjectId,
            ref: 'attendance'
        }],
        id_recordClassTaught: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'RecordClassTaught'
            }
        ],
        id_FinalConcepts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'FinalConcepts'
            }
        ],
        id_individualForm: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'IndividualForm'
            }
        ],
        id_iStQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'I_stQuarter'
        },
        id_iiNdQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'II_ndQuarter'
        },
        id_iiiRdQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'III_rdQuarter'
        },
        id_ivThQuarter: {
            type: mongoose.Types.ObjectId,
            ref: 'IV_thQuarter'
        },
        idRegentTeacher: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
        idRegentTeacher02: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
        idPhysicalEducationTeacher: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'employee'
            }
        ],
        idClass: {
            type: mongoose.Types.ObjectId,
            ref: 'class'
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
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Daily", Dailyschema);