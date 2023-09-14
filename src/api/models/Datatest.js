const mongoose = require("../../services/mongoose.service").mongoose;

const datatestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        alt: {
            type: String,
        },
        url: {
            type: String,
        },
        file: {
            type: String,
            default: 'noimage.jpg',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("Datatest", datatestSchema);
