const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        file: String,
        size: String,
        originalname: String,
        path: String,
        mimetype: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("files", filesSchema, "files");
