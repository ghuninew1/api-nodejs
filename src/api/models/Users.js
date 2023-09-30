const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        password: {
            type: String,
        },
        token: {
            type: String,
        },
        email: {
            type: String,
        },
        role: {
            type: String,
            default: "user",
        },
        avatar: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("users", userSchema, "users");
