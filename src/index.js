const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
// const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fs = require("fs");
const { Server } = require("socket.io");
const responseTime = require('response-time')

// const flash = require("express-flash");
// const session = require("express-session");

const visitRoute = require("./routes/visit");
const productRoute = require("./routes/products");
const datatestRoute = require("./routes/datatest");
const authRoute = require("./routes/auth");
const ioRoute = require("./services/ws");
const dbRoute = require("./api/db");
const speedtestRoute = require("./routes/speedteest");

const PORT = process.env.PORT || 3001;
const unixSocket = "/tmp/apignew.sock";

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));

// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("*", (req, res, next) => {
    // res.header("X-Response-Time", resTime(Date.now()) + " ms");
    res.header("X-Powered-By", "GhuniNew");
    if (req.method === "OPTIONS") {
        return res.status(500).end();
    } else {
        return next();
    }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use('*',responseTime((req, res, time) => {
    res.header("X-Response-Time", time + " ms");
    // console.log("res time", time);
}));

app.get("/", (req, res) => { 
    res.status(200).json({ message: "GhuniNew API" });
});

app.get("/ws", async (req, res) => {
    res.render("ws", { title: "GNEW", maindata: "GhuniNew API" });
});


// routes Api
visitRoute(app);
productRoute(app);
datatestRoute(app);
authRoute(app);
dbRoute(app);
speedtestRoute(app);

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
    transports: ["websocket", "polling"],
    cors: {
        origin: "*",
        credentials: true,
    },
});

// io.engine.use(
//     session({
//         secret: "ghuninew gnew",
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: true },
//     })
// );

// instrument(io, {
//     auth: {
//       type: 'basic',
//       username: "admin1",
//       password: "bbpadmin2022" // "changeit" encrypted with bcrypt
//     },
//   });

ioRoute(io);

module.exports = app;
