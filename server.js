const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
// const { Server } = require("socket.io");

const config = require("./config");
const authRoute = require("./src/routes/auth");
const apiRoute = require("./src/routes/api");
const socketIoInit = require("./src/services/ws");

const PORT = config.port;
const unixSocket = "/tmp/apignew.sock";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "./public"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// middlewares
app.use(bodyParser.json({ limit: "50mb", extended: true}));
app.use(cors({ origin: "*"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./public")));

//root route
app.get("/", (req, res) => { 
    res.header("X-Powered-By", "GhuniNew");
    res.status(200).json({ HOME: "API @GhuniNew" });
});

app.get("/ws", async (req, res) => {
    res.status(200).render("ws");
});

// routes Api
authRoute(app);
apiRoute(app);

// catch 404 and forward to error handler
app.use((req, res)=> {
    res.status(404).json({ url: req.originalUrl + " not found @GhuniNew" });
});

// error handler
app.use((err, req, res)=> {
    console.error(err.stack);
    res.status(500).json({ message: "Server Error @GhuniNew" });
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

// http server
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`);
});
socketIoInit(server);

module.exports = app;