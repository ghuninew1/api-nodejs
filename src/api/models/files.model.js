const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema(
    {
        name: String,
        alt: String,
        title: String,
        url: String,
        file: String,
        file_size: String,
        file_originalname: String,
        file_path: String,
        file_mimetype: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("files", filesSchema, "files");
