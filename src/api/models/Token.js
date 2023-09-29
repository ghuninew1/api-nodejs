const mongoose = require("mongoose");

const { Schema } = mongoose;
const tokenSchema = new Schema(
    {
        name: {
            type: String,
        },
        token: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("token", tokenSchema, "token");
