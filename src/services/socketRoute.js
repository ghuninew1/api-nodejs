const pingMetrics = require("./socket.io/pingMetrics");
const gatherOsMetrics = require("./socket.io/osMetrics");
const { currentUserWs } = require("../api/controllers/auth");

exports.socketRoute = (socket) => {
    currentUserWs(socket);
    
    socket.on("status", (nodeData) => {
        const span = {};
        span.responses = [];
        span.retention = 60;
        span.interval = 1;
        span.length = Object.values(nodeData).length;
        Object.values(nodeData).forEach((node, idx) => {
            const interval = setInterval(() => {
                span.ip = node.ip;
                pingMetrics(socket, span, idx);
            }, node.int * 1000);
            interval.unref();
        });
    })

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
    });
}


