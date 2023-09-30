const mongoose = require("mongoose");

const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: String,
        id: Number,
    },{
        timestamps: true,
        versionKey: false
    })
);

module.exports = Role;
