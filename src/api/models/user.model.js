const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: {
            type: String,
            ref: "Role",
            default: "user",
        },
        tokens: [{
            token: {
                type: String,
            },
            expires: {
                type: Date,
            },
        }],
    },{
        timestamps: true,
        versionKey: false
    })

);

module.exports = User;
