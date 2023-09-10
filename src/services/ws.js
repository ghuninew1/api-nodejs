// Desc: websocket service
module.exports = (io) => {
    let count = 0;
    io.on("connection", (socket) => {
        console.log(`connected with transport ${socket.conn.transport.name}` + " : " + socket.id);

        socket.conn.on("upgrade", (transport) => {
            console.log(`transport upgraded to ${transport.name}` + " : " + transport.id);
        });

        socket.on("disconnect", (reason) => {
            console.log(`disconnected due to ${reason}` + " : " + socket.id);
        });

        socket.on("message", ({ msg }) => {
            console.log(`received message ${msg}`);

            if (msg === "click") {
                socket.send({ data: count++ });
            } else {
                console.log("emitting error");
                socket.send({ data: count-- });
            }
        });
        socket.on("cpu", (callback) => {
            const startUsage = process.cpuUsage();
            const now = new Date().getTime();
            while (new Date().getTime() - now < 500);
            const nows = process.cpuUsage(startUsage);
            callback(nows, now);
        });
        socket.on("memory", (callback) => {
            callback(process.memoryUsage());
        });

        socket.on("ping", (callback) => {
            // callback();
            callback(new Date().getTime());
        });
    });
};
