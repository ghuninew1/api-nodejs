const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");

const config = require("./src/services/config");
const authRoute = require("./src/routes/auth");
const apiRoute = require("./src/routes/api");
const socketIoInit = require("./src/services/socket.io/index");
const { visitUpdate } = require("./src/api/middleware/visit");
const visits = require("./src/api/models/Visit");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "./public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// middlewares
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./public")));

app.use((req, res, next) => {
    res.header("X-powered-by", "GhuniNew");
    next();
});

const indexData = async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    const visitAll = await visits.find();
    const visit = (path) => visitAll.find((v) => path === v.url ? v : null);
    const counter = (path) => visit(path) ? visit(path).counter : 0;
    const counters = {
        all: visitAll.reduce((acc, cur) => acc + cur.counter, 0),
        index: counter("/"),
        ws: counter("/ws"),
        api: counter("/api"),
    }
    res.status(200).json({ message: "API GhuniNew", ip: ip , counters: counters});
};

const wsData = async (req, res) => {
    res.status(200).render("ws.html");
};
//root route
app.get("/", indexData );

app.get("/ws", wsData);

// routes Api
authRoute(app);
apiRoute(app);

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(404).json({ url: req.originalUrl + " not found @GhuniNew" });
});

// error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server Error @GhuniNew" });
});

//unix socket
// const unix = http.createServer(app);
// if (fs.existsSync(config.unix_socket)) {
//     fs.unlink(config.unix_socket, (err) => {
//         if (err) {
//             console.error(err);
//         }
//         unix.listen(config.unix_socket, () => {
//             console.log(`app running on socket ${config.unix_socket}`);
//         });
//     });
// } else {
//     unix.listen(config.unix_socket, () => {
//         console.log(`app running on socket ${config.unix_socket}`);
//     });
// }

// http server
const server = http.createServer(app);
server.listen(config.port, () => {
    console.log(`app running on http://localhost:${config.port}`);
});

socketIoInit(server);
