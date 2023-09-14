const { Server } = require("socket.io");
const gatherOsMetrics = require("./osMetrics");
const pingCheck = require("./pingCheck");

let io;

// const addSocketEvents = (socket, config) => {
//         // socket.emit("esm_start", config.spans);
//         socket.on("esm_start", () => {
//             socket.emit("esm_start", config.spans);

//             socket.on("esm_change", () => {
//                 socket.emit("esm_start", config.spans);
//             });
//         });

// };

module.exports = socketIoInit = (server, config, statuscode) => {
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
                socket.emit("esm_start", config.spans);
                socket.on("esm_change", () => {
                    socket.emit("esm_start", config.spans);
                });
            });

            await pingCheck(socket, statuscode);
            return config.spans.forEach((span) => {
                span.os = [];
                span.responses = [];
                socket.on("esm_on", () => {
                    const interval = setInterval(
                        async () => await gatherOsMetrics(io, span),
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
