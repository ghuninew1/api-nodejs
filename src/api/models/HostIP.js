const mongoose = require("../../services/mongoose.service").mongoose;

const hostipsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        status: {
            type: String,
        },
        ip: {
            type: String,
        },
        res: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("Hostip", hostipsSchema);
