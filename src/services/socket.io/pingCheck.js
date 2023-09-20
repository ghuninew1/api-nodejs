const HostIP = require("../../api/models/HostIP");
const ping = require("ping");

module.exports = async (io) => {
    io.on("status", (nodeData) => {
        const pingCheck = (cout) => {
            Object.values(nodeData).forEach((node, idx) => {
                ping.promise
                    .probe(node.ip, {
                        timeout: 10,
                        extra: ["-i 2"],
                    })
                    .then((res) => {
                        const isAlive = res.alive;
                        const updateStatus = isAlive ? "online" : "offline";
                        io.emit("nodeStatus", {
                            id: idx,
                            status: updateStatus,
                            ip: res.numeric_host,
                            res: Number(res.time).toFixed(3),
                            loss: Number(res.packetLoss).toFixed(2),
                            cout: cout,
                            dns: res.host,
                        });
                    })
                    .catch((err) => {
                        console.log("ping promise error" + err);
                    });
            });
        };
        // setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const cout = i + 1;
            setTimeout(() => {
                pingCheck(cout);
            }, 1000 * cout);
        }
        // }, 10000);
    });
};
