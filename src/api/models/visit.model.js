const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        counter: {
            type: Number,
            required: true,
        },
        ip: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("visit", visitSchema, "visit");
