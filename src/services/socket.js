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
                const session = socket.request.session;
                socket.join(session.id);

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

                console.log("socket connected", socket.id + " " + session.id);

                socket.on("disconnect", () => {
                    console.log(
                        "socket disconnected",
                        socket.conn.remoteAddress + " " + socket.id + " " + session.id
                    );
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
