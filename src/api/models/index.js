const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const basename = path.basename(__filename);

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

const name = fs
    .readdirSync(__dirname)
    .filter((file) => {
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .map((file) => {
        return file.split(".")[0];
    });

name.forEach((file) => {
    db[file] = require("./" + file + ".model");
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
