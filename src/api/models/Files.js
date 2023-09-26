const mongoose = require("../../services/mongoose.service").mongoose;

const filesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        file: {
            type: String,
            default: 'noimage.jpg',
        },
        file_size: {
            type: String,
        },
        file_originalname: {
            type: String,
        },
        file_path: {
            type: String,
        },
        file_mimetype: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("files", filesSchema, "files");
