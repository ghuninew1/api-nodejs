const mongoose = require("mongoose");

const pingSchema = new mongoose.Schema(
    {
        ip: String,
        res: Number,
        createdAt: { type: Date, default: Date.now},
        metadata: {
            max: Number,
            min: Number,
            avg: Number,
            host: String,
        },
    },
    {
        timeseries: {
            timeField: "createdAt",
            metaField: "metadata",
            granularity: "hours",
        },
        versionKey: false,
        timestamps: false,
    }
);

pingSchema.index({ ip: 1, createdAt: 1 });

module.exports = mongoose.model("Ping", pingSchema);
