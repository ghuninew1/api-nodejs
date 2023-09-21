const HostIP = require("../../api/models/HostIP");
const ping = require("ping");

module.exports = async (io) => {
    io.on("status", (nodeData) => {
        const pingCheck = async () => {
            Object.values(nodeData).forEach(async (node, idx) => {
                const ress = await ping.promise.probe(node.ip, {
                    timeout: 10,
                    extra: ["-i", "2"],
                });

                io.emit("nodeStatus", {
                    id: idx,
                    data: ress,
                });
            });
        };
        // setInterval(() => {
        //     setTimeout(() => {
                pingCheck();
        //     }, 1000);
        // }, 5000);
    });
};
