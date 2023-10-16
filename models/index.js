const mongoose = require("mongoose");
const { readdirSync } = require("fs");

// connect to the database
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

// name of the database
const name = readdirSync("./models")
    .filter((file) => file.slice(-8) === "model.js" && file !== "index.js")
    .map((f) => f.slice(0, -9));

// import all models
name.forEach((n) => {
    db[n] = require("./" + n + ".model");
} );

// export the database
module.exports = db;
