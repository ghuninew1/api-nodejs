const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const basename = path.basename(__filename);

// connect to the database
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

// name of the database
const name = fs
    .readdirSync(__dirname)
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
    .map((file) => file.split(".")[0]);

// import all models
name.forEach((file) => {
    db[file] = require("./" + file + ".model");
});

// Roles for users
db.ROLES = ["user", "admin", "moderator"];

// export the database
module.exports = db;
