const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const FileLogoSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    id_school: {
        type: mongoose.Types.ObjectId,
        ref: 'school'
    },
});

FileLogoSchema.pre("save", function () {
    if (!this.url) {
        this.url = `${process.env.BASE_URL}/files/${this.key}`;
    }
});
FileLogoSchema.pre("remove", function () {
    if (process.env.STORAGE_TYPE === "s3") {
        return s3
            .deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: this.key
            })
            .promise()
            .then(response => {
                console.log(response.status);
            })
            .catch(response => {
                console.log(response.status);
            });
    } else {
        return promisify(fs.unlink)(
            path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
        );
    }
});

module.exports = mongoose.model("FileLogo", FileLogoSchema);