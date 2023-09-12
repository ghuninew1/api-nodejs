const { Server } = require("socket.io");
const gatherOsMetrics = require("./gather-os-metrics");
const onHeadersListener = require("./on-headers-listener");

let io;

const addSocketEvents = (socket, config) => {
    socket.emit("esm_start", config.spans);
    socket.on("esm_change", () => {
        socket.emit("esm_start", config.spans);
    });
};

module.exports = socketIoInit = (server, config) => {
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
        });
        const spans = config.spans;

        
        spans.forEach((span) => {
            span.os = [];
            span.responses = [];
            const interval = setInterval(() => gatherOsMetrics(io, span), span.interval * 1000);
            // Don't keep Node.js process up
            interval.unref();
        });

        const onHeaders = (res) => {
        const startTime = process.hrtime();
        onHeadersListener( res, startTime, spans);
        };

        server.on("request", onHeaders);

    } else {
        console.log("Socket.io already initialized");
    }
};