const { Server } = require("socket.io");
const gatherOsMetrics = require("./osMetrics");
const pingMetrics = require("./pingMetrics");

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

module.exports = socketIoInit = async (server) => {
    if (io === null || io === undefined) {
        io = new Server(server, {
            path: "/ws",
            transports: ["polling", "websocket", "webtransport"],
            cors: { origin: "*", credentials: true },
            httpCompression: {
                // Engine.IO options
                threshold: 2048, // defaults to 1024
                // Node.js zlib options
                chunkSize: 8 * 1024, // defaults to 16 * 1024
                windowBits: 14, // defaults to 15
                memLevel: 7, // defaults to 8
            },
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
            });
            console.log("Socket connected: " + socket.id);

            socket.on("disconnect", (reason) => {
                console.log(`disconnected due to ${reason}` + " : " + socket.id);
            });

            spans.forEach((span) => {
                span.os = [];
                span.responses = [];

                socket.on("esm_on", () => {
                    socket.emit("esm_start", spans);
                    socket.on("esm_change", () => {
                        socket.emit("esm_start", spans);
                    });
                    const interval = setInterval(() => {
                        gatherOsMetrics(socket, span);
                    }, span.interval * 1000);
                    interval.unref();
                });

                socket.on("status", (nodeData) => {
                    span.length = Object.values(nodeData).length;
                    Object.values(nodeData).forEach((node, idx) => {
                        const interval = setInterval(() => {
                            span.ip = node.ip;
                            pingMetrics(socket, span, idx);
                        }, node.int * 1000);
                        interval.unref();
                    });
                });
            });
        });
        return io;
    } else {
        console.log("Socket.io already initialized");
        return io;
    }
};
