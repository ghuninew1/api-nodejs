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
const visits = require("./src/api/models/Visit");
const { visitUpdate } = require("./src/api/middleware/visit");

const app = express();
exports.app = app;

// view engine setup
app.set("views", path.join(__dirname, "./public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// middlewares
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
app.use(express.static(path.join(__dirname, "./public")));
app.use((req, res, next) => {
    const startAt = process.hrtime();
    const elapsed = process.hrtime(startAt);
    const ms = (elapsed[0] * 1000000000 + elapsed[1]) / 1000;
    res.header("X-powered-by", "GhuniNew");
    res.header("X-Response-Time", `${ms.toFixed(3)} ms`);
    next();
});

// routes
const indexData = async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    const visitAll = await visits.find();
    const visit = (path) => visitAll.find((v) => path === v.url ? v : null);
    const counter = (path) => visit(path) ? visit(path).counter : 0;
    const counters = {
        all: visitAll.reduce((acc, cur) => acc + cur.counter, 0),
        index: counter("/"),
        ws: counter("/ws"),
    }
    res.status(200).json({ message: "API GhuniNew", ip: ip, counters: counters });
};

const wsData = async (req, res) => {
    res.status(200).render("ws.html");
};

//root route
app.get("/",visitUpdate, indexData );

app.get("/ws",visitUpdate, wsData);

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
    const addr = server.address();
    const address = addr.address === "::" ? "localhost" : addr.address;
    console.log(`app running on ` +"http://" + address + ":" + addr.port);
});
// socket.io
socketIoInit(server);