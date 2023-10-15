#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require("../app");
const debug = (log) => console.log(log);
const http = require("http");
const { connect } = require("../src/api/config/db.config");
const socketRoute = require("../src/services/socket");
/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};


// Event listener for HTTP server "listening" event.
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? addr : "http://localhost:" + addr.port + "/";
    debug("Listening on " + bind);
};

// mongoose connection
connect();


// socket.io connection
socketRoute(server);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);