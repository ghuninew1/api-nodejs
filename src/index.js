const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const { Server } = require("socket.io");
const responseTime = require('response-time');

const authRoute = require("./routes/auth");
const ioRoute = require("./services/ws");
const apiRoute = require("./routes/api");
const speedtestRoute = require("./routes/speedteest");

const PORT = process.env.PORT || 3001;
const unixSocket = "/tmp/apignew.sock";

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors({ origin: "*"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.use('*',responseTime((req, res, time) => {
    res.header("X-Response-Time", time + " ms");
    res.header("X-Powered-By", "GhuniNew");
}));

// view engine setup
app.set("views", path.join(__dirname, "../public"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//root route
app.get("/", (req, res) => { 
    res.status(200).json({ HOME: "API @GhuniNew" });
});

app.get("/ws", async (req, res) => {
    res.status(200).render("ws");
});

// routes Api
authRoute(app);
apiRoute(app);
speedtestRoute(app);

// catch 404 and forward to error handler
app.use((req, res)=> {
    res.status(404).send({ url: req.originalUrl + " not found @GhuniNew" });
});

// error handler
app.use((err, req, res)=> {
    console.error(err.stack);
    res.status(500).send("Something broke! @GhuniNew");
});

// http server
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`);
});

//unix socket
const unix = http.createServer(app);
if (fs.existsSync(unixSocket)) {
    fs.rm(unixSocket, (err) => {
        unix.listen(unixSocket, () => {
            fs.chmodSync(unixSocket, "775");
            console.log(`app running on socket ${unixSocket}`);
        });
        if (err) {
            console.error(err);
        }
    });
} else {
    unix.listen(unixSocket, () => {
        fs.chmodSync(unixSocket, "775");
        console.log(`app running on socket ${unixSocket}`);
    });
}

// socket io
const io = new Server(server, {
    transports: ["websocket", "polling"],
    cors: {
        origin: "*",
        credentials: true,
    },
});
ioRoute(io);

module.exports = app;
