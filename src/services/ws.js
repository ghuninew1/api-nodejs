const e = require("express");
const session = require("express-session");

module.exports = io => {
    io.on("connection", (socket) => {
        console.log(`connected with transport ${socket.conn.transport.name}`);
    
        socket.conn.on("upgrade", (transport) => {
            console.log(`transport upgraded to ${transport.name}`);
        });
    
        socket.on("disconnect", (reason) => {
            console.log(`disconnected due to ${reason}`);
        });
    
        const startUsage = process.cpuUsage()
        const now = Date.now();
        while (Date.now() - now < 500);
        
        socket.on("message", ({msg}) => {
            console.log(`received message ${msg}`);
            if (msg === "click") {
                setInterval(() => {
                    socket.send({cpus: process.cpuUsage(startUsage), memory: process.memoryUsage()});
                } , 2000);
            } else if (msg === "disconnect") {
                clearInterval();
                socket.disconnect();
            } else {
                clearInterval();
            }
        });

        socket.on("ping", (callback) => {
            callback();
        });
    });
};