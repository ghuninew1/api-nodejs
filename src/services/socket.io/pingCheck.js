const HostIP = require("../../api/models/HostIP");
const ping = require("ping");

exports.pingCheck = async (socket, nodeData) => {
    try {
        Object.values(nodeData).forEach(async (node, idx) => {
            const interval = setInterval(async () => {
                const ress = await ping.promise.probe(node.ip, {
                    timeout: 10,
                    extra: ["-i", "2"],
                });
                const status = ress.alive ? "online" : "offline";
                socket.emit("nodeStatus", {
                    id: idx,
                    data: ress,
                });
                if (status === "online") {
                    const myObj = {
                        ip: ress.numeric_host,
                        res: ress.time,
                        status: status,
                        timestamp: new Date(),
                        metadata: ress,
                    };
                    const timeOut = setTimeout(async () => {
                        try {
                            const hosts = new HostIP(myObj);
                            await hosts.save();
                        } catch (error) {
                            console.log("error: ", error);
                        }
                    }, node.int * 5000);
                    timeOut.unref();
                }
            }, node.int * 1000);
            interval.unref();
        });
    } catch (error) {
        console.log("socker error: ", error);
    }
};
