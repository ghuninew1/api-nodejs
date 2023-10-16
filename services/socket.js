const { Server } = require("socket.io");
const { socketRoute } = require("./socketRoute");

let io = null;
module.exports = (server) => {
    try {
        if (!io && server) {
            io = new Server(server, {
                path: "/ws",
                transports: ["polling", "websocket", "webtransport"],
                cors: { origin: "*", credentials: true },
            });
            io.on("connection", (socket) => {
                console.log(socket.conn.transport.name +": "+ socket.id + " ,ip: " + socket.handshake.address);

                socket.conn.on("upgrade", () => {
                    console.log(socket.conn.transport.name);
                });

                socket.on("disconnect", (reason) => {
                    console.log(`id: ${socket.id} , ${reason} ,ip: ${socket.handshake.address}`);
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
