const HostIP = require("../../api/models/HostIP");
const ping = require("ping");

module.exports = async (io, statuscode) => {
    const nodeData = await HostIP.find({});
    if (nodeData.length !== 0) {
        io.on("status", () => {
            setInterval(() => {
                Object.values(nodeData).forEach((node, idx) => {
                    const starttime = process.hrtime();
                    const diff = process.hrtime(starttime);
                    const responseTime = (diff[0] * 1e3 + diff[1]) * 1e-6;
                    // const category = Math.floor(statuscode / 100);

                    ping.sys.probe(node.ip, (isAlive) => {
                        const updateStatus = isAlive ? "up" : "down";
                        io.emit("nodeStatus", {
                            id: idx,
                            name: node.name,
                            status: updateStatus,
                            ip: node.ip,
                            res: Number(responseTime * 1000).toFixed(4),
                            timestamp: new Date().toLocaleString('th'),
                        });
                    });
                });
            }, 5000);
        });
    } else {
        console.log("No Data");
    }
};
