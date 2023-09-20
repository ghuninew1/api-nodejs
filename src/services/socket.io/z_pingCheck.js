const HostIP = require("../../api/models/HostIP");
const ping = require("ping");

module.exports = async (io) => {
    const nodeData = await HostIP.find({});
    if (nodeData.length !== 0) {
        io.on("status", () => {
            // setInterval(() => {
                Object.values(nodeData).forEach((node, idx) => {
                    ping.promise.probe(node.ip, {
                        timeout: 10,
                        extra: ["-i 2"],
                    }).then((res) => {
                        console.log("res", res);
                        const isAlive = res.alive;
                        const updateStatus = isAlive ? "online" : "offline";
                        io.emit("nodeStatus", {
                            id: idx,
                            name: node.name,
                            status: updateStatus,
                            ip: res.host,
                            res: Number(res.time).toFixed(3),
                            avg: Number(res.avg).toFixed(3),
                        });
                        io.emit("resStatus", res.output);
                    });
                });
            // }, 5000);
        });
    } else {
        console.log("No Data");
    }
};
