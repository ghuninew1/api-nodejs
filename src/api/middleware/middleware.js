const path = require("path");
const fs = require("fs");

exports.middleware = async (req, res, next) => {
    res.startAt = process.hrtime();
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    res.header("X-powered-by", "GhuniNew");
    res.on("finish", async () => {
        const elapsed = process.hrtime(res.startAt);
        const ms = (elapsed[0] * 1000) + (elapsed[1] / 1000000);
        const fsSync = fs.createWriteStream(path.join(__dirname, "../logs/access.log"), { flags: "a", encoding: "utf8" });
        const log = `[${req.method}] : ${res.statusCode} : [${ms.toFixed(3)} ms] : ${new Date().toLocaleString('th-TH')} : ${ip} : ${req.originalUrl} ${req.headers["user-agent"]}`;
        fsSync.write(log + "\n");
        console.log(`${ip} [${req.method}] : ${res.statusCode} : ${req.originalUrl} :[${ms.toFixed(3)} ms] `);
        fsSync.end();
    });
    next();
};
