const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        roles: [
            {
                role: String,
                id: Number,
            },
        ],
        tokens: [
            {
                token: String,
                expires: Date,
            },
        ],
        enabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("users", usersSchema, "users");
