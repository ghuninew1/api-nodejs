const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema(
    {
        id: { type: Number, default: Math.random()*1000 + 1 },
        name: String,
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

filesSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model("files", filesSchema);
