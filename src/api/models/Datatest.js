const mongoose = require("../../services/mongoose.service").mongoose;

const datatestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        alt: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("Datatest", datatestSchema);
