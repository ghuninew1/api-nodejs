const { Server } = require("socket.io");
// const HostIP = require("../api/controllers/socketio");

let io;

const addSocketEvents = (socket, data) => {
    socket.emit("esm_start", data);
    socket.on("esm_change", () => {
        socket.emit("esm_start", data);
    });
};

module.exports = socketIoInit = (server) => {
    if (io === null || io === undefined) {
        io = new Server(server, {
            path: "/ws",
            transports: ["polling", "websocket", "webtransport"],
            cors: {
                origin: "*",
                credentials: true,
            },
            pingTimeout: 20000,
            pingInterval: 25000,
            serveClient: false,
            perMessageDeflate: true,
            connectTimeout: 20000,
            cleanupEmptyChildNamespaces: true,
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
        });
    } else {
        console.log("Socket.io already initialized");
    }
};