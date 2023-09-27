const HostIP = require("../../api/models/HostIP");
const ping = require("ping");

exports.pingCheck = async (socket, nodeData) => {
    try {
        const pingCheck = () => {
            Object.values(nodeData).forEach((node, idx) => {
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

                    // if (status === "online") {
                    //     const updateData = HostIP.insertMany([{ip: ress.numeric_host, status: status, res: ress.time}]);
                    //     updateData ? console.log("update success") : console.log("update fail");
                    // } 
                }, node.int * 1000);
                interval.unref();
            });
        };
        setTimeout(() => pingCheck(), 1000);
    } catch (error) {
        console.log("socker error: ", error);
    }
};
