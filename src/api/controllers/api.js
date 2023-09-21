const mongoose = require("../../services/mongoose.service").mongoose;
const Datatest = require("../models/Datatest");
const Product = require("../models/Product");
const Visits = require("../models/Visit");
const Users = require("../models/Users");
const Hostip = require("../models/HostIP");
const fs = require("fs");
const ping = require("ping");

const dbName = {
    users: Users,
    datatest: Datatest,
    product: Product,
    visits: Visits,
    hostip: Hostip,
};
const db = mongoose.connection;

exports.findAll = async (req, res) => {
    try {
        const dball = async () => {
            const data = await db.db.listCollections().toArray();
            return data;
        };
        const data = await dball();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const data = await db.db.collection(name).find({}).toArray();
            data ? res.status(200).json(data) : res.status(404).json({ message: "Find Fail" });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findById = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const id = req.params.id;
            dbName[name]
                .findById({ _id: id })
                .exec()
                .then((data) => {
                    data
                        ? res.status(200).json(data)
                        : res.status(404).json({ message: "Find Fail" });
                });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const data = req.body;
            if (req.file) {
                data.file = req.file.filename;
            }
            const fileCreate = new dbName[name](data);
            await fileCreate.save();
            res.status(201).json({ message: "Create Success" });
        } else {
            res.status(404).json({ message: "Not Create" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateByid = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const data = req.body;
            const id = req.params.id;
            if (req.file) {
                data.file = req.file.filename;
            }
            const fileUpdate = await dbName[name].findOneAndUpdate({ _id: id }, data).exec();
            if (fileUpdate?.file) {
                fs.unlinkSync(`./public/uploads/${fileUpdate.file}`, (err) => {
                    if (err) {
                        res.status(500).json({ message: err.message });
                    }
                });
                fileUpdate
                    ? res.status(200).json({ message: "Update Success" })
                    : res.status(404).json({ message: "Update Fail" });
            } else {
                fileUpdate
                    ? res.status(200).json({ message: "Update Success" })
                    : res.status(404).json({ message: "Update Fail" });
            }
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteByid = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const id = req.params.id;
            const fileRemove = await dbName[name].findOneAndDelete({ _id: id }).exec();
            if (fileRemove?.file) {
                fs.unlinkSync(`./public/uploads/${fileRemove.file}`, (err) => {
                    if (err) {
                        res.status(500).json({ message: err.message });
                    }
                });
                fileRemove
                    ? res.status(200).json({ message: "Delete Success" })
                    : res.status(404).json({ message: "Delete Fail" });
            } else {
                fileRemove
                    ? res.status(200).json({ message: "Delete Success" })
                    : res.status(404).json({ message: "Delete Fail" });
            }
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const models = async (name) => {
                db.db.collection(name).drop();
            };
            await models(name);
            res.status(200).json({ message: "Delete Success" });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.visits = async (req, res) => {
    try {
        const url = req.query.url;
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
        const visit = await Visits.findOne({ url: url });
        const counter = visit ? visit.counter : 0;
        const dns = require("dns");
        dns.lookup(url, async (err, address, family) => {
            if (err) {
                address = "Not Found";
                family = "Not Found";
            }
            if (url !== "") {
                if (visit) {
                    await Visits.updateOne(
                        { url: url },
                        { $inc: { counter: 1 } },
                        { $set: { ip: address } },
                        { new: true }
                    );
                } else {
                    await Visits.create({ url: url, counter: 1, ip: address });
                }
                res.status(200).json({
                    message: "Visit Success",
                    ip: ip,
                    url: url,
                    address: address,
                    family: family,
                    counter: counter,
                });
            } else {
                res.status(404).json({ message: "Not Found please enter url" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.pingCheck = async (req, res) => {
    try {
        const ip = req.query.ip;
        const ips = ip.split(",");
        if (ips.length > 1) {
            const ress = [];
            for (let i = 0; i < ips.length; i++) {
                const resping = await ping.promise.probe(ips[i], {
                    timeout: 10,
                    extra: ["-i", "2"],
                });
                ress.push(resping);
            }
            res.status(200).json(ress);
        } else {
            const ress = await ping.promise.probe(ip, {
                timeout: 10,
                extra: ["-i", "2"],
            });
            res.status(200).json(ress);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.ipPublic = async (req, res) => {
    try {
        const ip = req.query.ip;
        if (ip) {
            const ipinfo = `https://ipinfo.io/${ip}/json?token=f44742fe54a2b2`
            const Response = await fetch(ipinfo);
            const data = await Response.json();
            res.status(200).json({ ip: ip, data: data });
        } else {
            const url = "https://ifconfig.me/all.json"
            const url2 = "https://ipinfo.io/json?token=f44742fe54a2b2"
            const Response = await fetch(url);
            const Response2 = await fetch(url2);
            const data = await Response.json();
            const data2 = await Response2.json();
            res.status(200).json({ ip: req.ip, data: data , data2: data2});
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};