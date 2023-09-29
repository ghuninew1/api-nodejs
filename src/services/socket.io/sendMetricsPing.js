module.exports = (socket, span) => {
    socket.emit("nodeStatus", {
        id: span.id,
        data: span.data,
        responses: span.responses[span.responses.length - 2],
        interval: span.interval,
        retention: span.retention,
    });
};
