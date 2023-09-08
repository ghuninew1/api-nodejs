const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fs = require("fs");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

// const flash = require("express-flash");
const session = require("express-session");

const visitRoute = require("./api/routes/visit");
const productRoute = require("./api/routes/products");
const datatestRoute = require("./api/routes/datatest");
const authRoute = require("./api/routes/auth");
const resTime = require("./services/resTime");
const ioRoute = require("./services/ws");
const dbRoute = require("./api/db");

const PORT = process.env.PORT || 3001;
const unixSocket = "/tmp/apignew.sock";

const app = express();

// middlewares
app.use(bodyParser.json({extended: true}));
app.use(cors({ origin: "*" , credentials: true}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger("dev"));

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
    encoding: "utf8",
});
app.use(
    logger("combined", {
        stream: accessLogStream,
        // skip: function (req, res) { return res.statusCode < 400 }
    })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
    res.header("X-Response-Time", resTime(process.hrtime()) + " ms");
    res.header("X-Powered-By", "GhuniNew");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const dataRes = resTime(process.hrtime()) + " ms";
    res.render("index", {
        title: "GNEW",
        maindata: dataRes,
        people: req.ip,
    });
});

app.get("/ws", (req, res) => {
    const dataRes = resTime(process.hrtime()) + " ms";
    res.render("ws", { title: "GNEW", maindata: dataRes });
});

// routes Api
visitRoute(app);
productRoute(app);
datatestRoute(app);
authRoute(app);
dbRoute(app);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + " not found" });
});

// error handler
app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`);
});

const unix = http.createServer(app);

if (fs.existsSync(unixSocket)) {
    fs.rm(unixSocket, (err) => {
        unix.listen(unixSocket, () => {
            fs.chmodSync(unixSocket, "777");
            console.log(`app running on socket ${unixSocket}`);
        });
        if (err) {
            console.error(err);
        }
    });
} else {
    unix.listen(unixSocket, () => {
        fs.chmodSync(unixSocket, "777");
        console.log(`app running on socket ${unixSocket}`);
    });
}

// const io = new Server(server);
const io = new Server(server, {
    pingInterval: 300,
    pingTimeout: 200,
    maxPayload: 1000000,
    transports: [ "websocket", "polling" ],
    cors: { 
        origin: "*",
        allowedHeaders: "*",
        credentials: true,
    }
});

io.engine.use(
    session({
        secret: "ghuninew gnew",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
);

// instrument(io, {
//     auth: {
//       type: 'basic',
//       username: "admin1",
//       password: "bbpadmin2022" // "changeit" encrypted with bcrypt
//     },
//   });

ioRoute(io)

module.exports = app;
