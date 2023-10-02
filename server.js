const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { readdirSync } = require("fs");

const { config, connect } = require("./src/api/config/db.config");
const socketIoInit = require("./src/services/socket");
const { visitUpdate } = require("./src/api/middleware/visit");
const { middleware } = require("./src/api/middleware/middleware");

const app = express();
connect();

// view engine setup
app.set("views", path.join(__dirname, "./public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// middlewares
app.use(bodyParser.json({ limit: "150mb" }));
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(path.join(__dirname, "./public")));
app.use("*", middleware);
app.set("trust proxy", true);

// routes
const indexData = async (req, res) => {
    res.status(200).json({ message: "API GhuniNew" });
};
const wsData = async (req, res) => {
    res.status(200).render("ws.html");
};

//root route
app.get("/", visitUpdate, indexData);

app.get("/ws", visitUpdate, wsData);

readdirSync("./src/routes")
    .filter((f) => f.slice(-8) === "route.js")
    .map((r) => app.use("/", require("./src/routes/" + r)));

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(404).json({ url: req.originalUrl + " not found @GhuniNew" });
});

// error handler
app.use((err, req, res) => {
    res.status(500).json({ message: "Server Error @GhuniNew", err });
});

// http server
const server = http.createServer(app);
server.listen(config.port, () => {
    const addr = server.address();
    const address = addr.address === "::" ? "localhost" : addr.address;
    console.log(`app running on ` + "http://" + address + ":" + addr.port);
});

// socket.io
app.io = socketIoInit(server);
exports.app = app;
