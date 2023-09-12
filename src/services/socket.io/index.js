const { Server } = require("socket.io");
const gatherOsMetrics = require("./osMetrics");
const pingCheck = require("./pingCheck");

let io;

const addSocketEvents = (socket, config) => {

    socket.emit("esm_start", config.spans);
    socket.on("esm_change", () => {
        socket.emit("esm_start", config.spans);
    });
};

module.exports = socketIoInit = (server, config, statuscode) => {
    if (io === null || io === undefined) {
        io = new Server(server, {
            path: "/ws",
            transports: ["polling", "websocket", "webtransport"],
            cors: { origin: "*", credentials: true },
            pingTimeout: 20000,
            pingInterval: 25000,
            perMessageDeflate: true,
            connectTimeout: 20000,
        });

        io.on("connection", (socket) => {
            console.log(
                `connected with transport ${socket.conn.transport.name}` + " : " + socket.id
            );

            socket.conn.on("upgrade", (transport) => {
                console.log(`transport upgraded to ${transport.name}` + " : " + transport.id);
            });

            socket.on("disconnect", (reason) => {
                console.log(`disconnected due to ${reason}` + " : " + socket.id);
            });
            addSocketEvents(socket, config);
            pingCheck(socket, statuscode);
        });
        return config.spans.forEach((span) => {
            span.os = [];
            span.responses = [];
            const interval = setInterval(() => gatherOsMetrics(io, span), span.interval * 1000);
            // Don't keep Node.js process up
            interval.unref();
        });

        // const spans = config.spans;
    } else {
        console.log("Socket.io already initialized");
    }
};
