const mongoose = require("../../services/mongoose.service").mongoose;

const visitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        value: {
            type: Number,
        },
        detail: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("Visit", visitSchema);
