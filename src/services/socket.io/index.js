const { Server } = require("socket.io");
const gatherOsMetrics = require("./osMetrics");
const pingCheck = require("./pingCheck");

let io;

const spans = [
    {
        interval: 1,
        retention: 60,
    },
    {
        interval: 5,
        retention: 60,
    },
    {
        interval: 15,
        retention: 60,
    },
];

module.exports = socketIoInit = (server) => {
    if (io === null || io === undefined) {
        io = new Server(server, {
            path: "/ws",
            transports: ["websocket", "polling", "webtransport"],
            cors: { origin: "*", credentials: true },
        });
        io.on("connection", async (socket) => {
            const transport = socket.conn.transport.name;

            socket.conn.on("upgrade", () => {
                const upgradedTransport = socket.conn.transport.name;
                if (transport !== upgradedTransport) {
                    console.log(
                        `Socket ${socket.id} upgraded from ${transport} to ${upgradedTransport}`
                    );
                }
                console.log("Socket upgraded");
            });
            console.log("Socket connected: " + socket.id);
            
            socket.on("disconnect", (reason) => {
                console.log(`disconnected due to ${reason}` + " : " + socket.id);
            });

            socket.on("esm_on", () => {
                socket.emit("esm_start", spans);
                socket.on("esm_change", () => {
                    socket.emit("esm_start", spans);
                });
            });

            await pingCheck(socket);
            spans.forEach((span) => {
                span.os = [];
                span.responses = [];
                socket.on("esm_on", () => {
                    const interval = setInterval(
                        async () => gatherOsMetrics(io, span),
                        span.interval * 1000
                    );
                    interval.unref();
                });
            });
        });
        return io;
    } else {
        console.log("Socket.io already initialized");
        return io;
    }
};
