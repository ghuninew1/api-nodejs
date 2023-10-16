const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { handleError } = require("./services/utils");
const session = require("express-session");
const morgan = require("morgan");

const app = express();

// view engine setup
app.set("views", "./public");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("trust proxy", true);

// middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("./public"));
app.use(session({
        secret: "ghuninew new",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(morgan("dev"));
app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "GhuniNew");
    next();
});

// Routes
fs.readdirSync("./routes")
    .filter((f) => f.slice(-8) === "route.js")
    .map((r) => app.use("/", require("./routes/" + r)));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next({ statusCode: 404, message: "Not Found 404" });
});

// error handler
app.use((err, req, res, next) => {
    handleError(err, res);
});

module.exports = app;