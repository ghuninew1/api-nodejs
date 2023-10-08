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
                socket.conn.on("upgrade", () => {
                    if (socket.conn.transport.name === "webtransport") {
                        console.log("webtransport");
                    }
                });

                socket.conn.transport.on("upgrade", () => {
                    if (socket.conn.transport.name === "webtransport") {
                        console.log("transport webtransport");
                    }
                });

                socket.conn.transport.on("close", () => {
                    console.log("transport close" + " " + socket.id);
                });

                console.log("socket connected", socket.id + " " + socket.conn.transport.name);

                socket.on("disconnect", () => {
                    console.log("socket disconnected", socket.conn.remoteAddress);
                });

                socket.on("error", (error) => {
                    console.log("socket error", error);
                });

                socketRoute(socket);
            });
            return io;
        } else {
            return io;
        }
    } catch (error) {
        console.log("error in socket.io", error);
    }
};
