const mongoose = require("mongoose");

const { Schema } = mongoose;
const pingSchema = new Schema(
    {
        ip: String,
        res: Number,
        timestamp: Date,
        metadata: {
            max: Number,
            min: Number,
            avg: Number,
            host: String,
        },
    },
    {
        timeseries: {
            timeField: "timestamp",
            metaField: "metadata",
            granularity: "hours",
        },
        versionKey: false,
    }
);
//create index for timestamp
pingSchema.index({ timestamp: 1 }, { unique: true });

const hostip = mongoose.model("ping", pingSchema, "ping");

module.exports = hostip;
