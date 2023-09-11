const HostIP = require("../api/controllers/socketio");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`connected with transport ${socket.conn.transport.name}` + " : " + socket.id);

        socket.conn.on("upgrade", (transport) => {
            console.log(`transport upgraded to ${transport.name}` + " : " + transport.id);
        });

        socket.on("disconnect", (reason) => {
            console.log(`disconnected due to ${reason}` + " : " + socket.id);
        });
        HostIP(socket);

    });
};
