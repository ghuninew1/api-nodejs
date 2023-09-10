const { set } = require("mongoose");
const hostip = require("../models/HostIP");
const ping = require("ping");


module.exports = async (io) => {

    const nodeData = await hostip.find({});
    // console.log(nodeData);
    const starttime = new Date().getTime();
    if (nodeData.length !== 0) {

        io.on("connection", (socket) => {
            socket.on("ping", (callback) => {
                const start = new Date();
                ping.sys.probe("", (isAlive) => {
                    const isTime = Date.now() - start.getTime() / 1000;
                    callback(isTime);
                } );
            });
            Object.values(nodeData).forEach((node) => {
                setInterval(() => {

                ping.sys.probe(node.ip, (isAlive) => {
                    const updateStatus = isAlive ? "up" : "down";
                    const end = new Date().getTime();
                    const isTime = (end - starttime) / 1000;
                    socket.emit("nodeStatus", {
                        id: node._id,
                        name: node.name,
                        status: updateStatus,
                        ip: node.ip,
                        res: isTime + "ms",
                    });
                });
                }, 5000);
        });
        clearInterval();

        });

    } else {
        console.log("No Data");
    }
};
