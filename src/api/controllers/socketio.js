const HostIP = require("../models/HostIP");
const ping = require("ping");

module.exports = async (io) => {
    const nodeData = await HostIP.find({});
    // console.log(nodeData);
    io.on("ping", () => {
        console.log("ping");
        setInterval(() => {
            const startUsage = process.cpuUsage();
            const now = new Date().getTime();
            while (new Date().getTime() - now < 500);
            const nows = process.cpuUsage(startUsage);
            io.emit("cpu", {
                user: nows.user,
                system: nows.system,
            });
        }, 5000);
        clearInterval();
    });
    
    if (nodeData.length !== 0) {
        io.on("status", () => {
            Object.values(nodeData).forEach((node, idx) => {
                setInterval(() => {
                    const starttime = new Date().getTime();
                    ping.sys.probe(node.ip, (isAlive) => {
                        const updateStatus = isAlive ? "up" : "down";
                        const end = new Date().getTime();
                        const isTime = end - starttime;
                        io.emit("nodeStatus", {
                            id: idx,
                            name: node.name,
                            status: updateStatus,
                            ip: node.ip,
                            res: isTime + "ms",
                        });
                    });
                }, 5000);
                clearInterval();
            });
        });
    } else {
        console.log("No Data");
    }
};
