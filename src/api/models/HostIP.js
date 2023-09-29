const mongoose = require("../../services/mongoose.service").mongoose;

const { Schema } = mongoose;
const hostdbSchema = new Schema(
    {
        ip: { type: String },
        res: { type: Number },
        status: { type: String },
        timestamp: { type: Date },
        metadata: { type: Object },
    },
    {
        timeseries: {
            timeField: "timestamp",
            metaField: "metadata",
            granularity: "hours",
        },
    }
);

const hostip = mongoose.model("hostip", hostdbSchema, "hostip");

module.exports = hostip;
