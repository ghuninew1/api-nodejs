const { Server } = require("socket.io");
const { socketRoute } = require("./socketRoute");

let io = null;

module.exports = (server) => {
    try {
        if (io === null || io === undefined) {
            io = new Server(server, {
                path: "/ws",
                transports: ["polling", "websocket", "webtransport"],
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
                });
                console.log("Socket connected: " + socket.id);
                socket.on("disconnect", (reason) => {
                    console.log(`disconnected due to ${reason}` + " : " + socket.id);
                });

                socketRoute(socket);

            });

            io.on("error", (err) => {
                console.log("socket error", err);
            });

            return io;

        } else {
            return io;
        }
    } catch (error) {
        console.log("error in socket.io", error);
    }
};
