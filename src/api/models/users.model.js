const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        roles: [{
            role: String,
            id: Number,
        }],
        tokens: [
            {
                token: String,
                expires: Date,
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
).index({ username: 1 }, { unique: true });

module.exports = mongoose.model("users", usersSchema, "users");
