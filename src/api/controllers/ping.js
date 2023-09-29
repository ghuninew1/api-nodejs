const ping = require("ping");
const Ping = require("../models/Ping");
const config = require("../../services/config");

exports.pingCheck = async (req, res) => {
    try {
        const ip = req.query.ip;
        const ipss = ip.split(",");

        if (ipss.length === 1) {
            const ress = await ping.promise.probe(ip, {
                timeout: 10,
                extra: ["-i", "2"],
            });
            await res.status(200).json(ress);
        } else {
            let result = [];
            for (let i = 0; i < ipss.length; i++) {
                const ress = await ping.promise.probe(ipss[i], {
                    timeout: 10,
                    extra: ["-i", "2"],
                });

                result.push(ress);
            }
            await res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.ipPublic = async (req, res) => {
    try {
        const ip = req.query.ip;
        if (ip) {
            const ipinfo = `https://ipinfo.io/${ip}/json?token=f44742fe54a2b2`;
            const Response = await fetch(ipinfo);
            const data = await Response.json();
            if (data.error) {
                res.status(404).json({ message: "Not Found" });
            } else {
                res.status(200).json(data);
            }
        } else {
            const url = "https://ipinfo.io/json?token=f44742fe54a2b2";
            const Response = await fetch(url);
            const data = await Response.json();
            if (data.error) {
                res.status(404).json({ message: "Not Found" });
            } else {
                res.status(200).json(data);
            }
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.insertTimeSeries = async (req, res) => {
    try {
        const data = req.body;
        if (data) {
            const pingCreate = await Ping.insertMany(data);
            pingCreate
                ? res.status(201).json({ message: "Create Success", data: data })
                : res.status(404).json({ message: "Not Found" });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.getIpTimeSeries = async (req, res) => {
    try {
        const ip = req.query.ip || req.body.ip;
        const host = req.query.host || req.body.host;
        const resultIp = [];
        const ping = await Ping.find({ ip: ip });
        const count = await Ping.countDocuments({ ip: ip });

        const getHostNumber = await Ping.find({ ip: ip }).distinct("metadata.host");
        const getIpNumber = await Ping.find().distinct("ip");

        const getHost = await Ping.find({ ip: ip }).distinct("metadata.host");
        const getIp = await Ping.find().distinct("ip");

        const getHostIp = await Ping.find({
            ip: ip,
            "metadata.host": host,
        }).distinct("metadata.host");

        const getHostIpNumber = await Ping.find({
            ip: ip,
            "metadata.host": host,
        }).distinct("ip");

        resultIp.push({
            ip: ip,
            count: count,
            host: getHost,
            hostNumber: getHostNumber,
            ipNumber: getIpNumber,
            data: ping,
        });

        const resultAll = [];
        const pingAll = await Ping.find();
        const countAll2 = await Ping.countDocuments();
        resultAll.push({
            count: countAll2,
            ip: getIp,
            ipNumber: getIpNumber,
            data: pingAll,
        });

        const resultHost = [];
        const pingHost = await Ping.find({ "metadata.host": host });
        const countHost = await Ping.countDocuments({ "metadata.host": host });
        resultHost.push({
            host: host,
            count: countHost,
            ip: getIp,
            ipNumber: getIpNumber,
            data: pingHost,
        });

        const resultHostIp = [];
        const pingHostIp = await Ping.find({ ip: ip, "metadata.host": host });
        const countHostIp = await Ping.countDocuments({
            ip: ip,
            "metadata.host": host,
        });
        resultHostIp.push({
            ip: ip,
            host: host,
            count: countHostIp,
            ipNumber: getHostIpNumber,
            hostNumber: getHostIp,
            data: pingHostIp,
        });

        if (ip && host) {
            res.status(200).json(resultHostIp);
        } else if (ip) {
            res.status(200).json(resultIp);
        } else if (host) {
            res.status(200).json(resultHost);
        } else {
            res.status(200).json(resultAll);
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};
