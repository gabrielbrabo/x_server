const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
    {
        /* =====================
           RELAÇÕES
        ===================== */
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },

        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        /* =====================
           DADOS DO ALUNO
        ===================== */
        studentName: {
            type: String,
            required: true
        },

        nationality: String,
        gender: String,

        birthDate: {
            type: Date,
            required: true
        },

        birthCity: String,
        birthState: String,

        motherName: String,
        fatherName: String,

        /* =====================
           DADOS ACADÊMICOS
        ===================== */
        course: {
            type: String,
            default: 'ENSINO FUNDAMENTAL'
        },

        conclusionDate: Date,

        /* =====================
           DADOS DA ESCOLA
        ===================== */
        schoolName: String,
        legalStatus: String,
        address: String,
        city: String,
        state: String,

        /* =====================
           CERTIFICADO
        ===================== */
        legalBasis: String,
        observations: String,

        certificateNumber: {
            type: String,
            unique: true
        },

        issuedAt: {
            type: Date,
            default: Date.now
        },

        isCanceled: {
            type: Boolean,
            default: false
        },

        canceledReason: String,
        canceledAt: Date
    },
    { timestamps: true }
);

CertificateSchema.pre('save', function (next) {
    if (!this.certificateNumber) {
        const year = new Date().getFullYear();
        this.certificateNumber = `CERT-${year}-${Date.now()}`;
    }
    next();
});

module.exports = mongoose.model('Certificate', CertificateSchema);
