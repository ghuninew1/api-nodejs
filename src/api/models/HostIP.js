const mongoose = require("../../services/mongoose.service").mongoose;

const { Schema } = mongoose;
const hostdbSchema = new Schema(
    {
        ip: {
            type: String,
        },
        status: {
            type: String,
        },
        name: {
            type: String,
        },
        res: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
    {
        timeseries: {
            timeField: "timestamp",
            metaField: "metadata",
            granularity: "hours",
        },
        expireAfterSeconds: 86400,
    }
);

const hostip = mongoose.model("hostip", hostdbSchema, "hostip");

module.exports = hostip;
