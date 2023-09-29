const Files = require("../models/Files");
const Product = require("../models/Product");
const Visits = require("../models/Visit");
const Users = require("../models/Users");
const Ping = require("../models/Ping");
const Token = require("../models/Token");
const fs = require("fs");
const config = require("../../services/config");
const mongoose = require("mongoose");

const dbName = {
    users: Users,
    files: Files,
    product: Product,
    visits: Visits,
    ping: Ping,
    token: Token,
};

exports.findAll = async (req, res) => {
    try {
        const dbAll = await mongoose.connection.db.listCollections().toArray();
        const datashow = req.query.data || req.body.data;
        const db = dbAll.map((item) => item.name);
        for (let i = 0; i < db.length; i++) {
            if (dbName[db[i]]) {
                const count = await dbName[db[i]].countDocuments();
                const data = await dbName[db[i]].find({}).exec();
                const create = await dbName[db[i]].find({}).sort({ createdAt: -1 }).limit(1).exec();
                const lastUpdate = await dbName[db[i]]
                    .find({})
                    .sort({ updatedAt: -1 })
                    .limit(1)
                    .exec();
                if (datashow === "true") {
                    db[i] = {
                        name: db[i],
                        count: count ? count : 0,
                        create: create[0]?.createdAt,
                        lastupdate: lastUpdate[0]?.updatedAt,
                        data: data,
                    };
                } else {
                    db[i] = {
                        name: db[i],
                        count: count ? count : 0,
                        create: create[0]?.createdAt,
                        lastupdate: lastUpdate[0]?.updatedAt,
                    };
                }
            } else {
                db[i] = { name: db[i], count: 0 };
            }
        }
        res.status(200).json(db);
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.findByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const data = await dbName[name].find({}).exec();
            if (data.length === 0) {
                res.status(404).json({ message: "Find Fail" });
            } else {
                res.status(200).json(data);
            }
        } else {
            res.status(404).json({ message: "Find Fail" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.findOne = async (req, res) => {
    try {
        const name = req.params.name;
        let limit = parseInt(req.query.limit);
        const sort = req.query.sort;
        const order = req.query.order;
        if (dbName[name]) {
            const data = await dbName[name]
                .find({})
                .limit(limit ? (limit > 1 ? limit : 0) : 20)
                .sort({ [sort]: order === "asc" ? 1 : -1 })
                .exec();
            if (data.length === 0) {
                res.status(404).json({ message: "Find Fail" });
            } else {
                res.status(200).json(data);
            }
        } else {
            res.status(404).json({ message: "Find Fail" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.findById = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const id = req.params.id;
            await dbName[name]
                .findById({ _id: id })
                .exec()
                .then((data) => {
                    data
                        ? res.status(200).json(data)
                        : res.status(404).json({ message: "Find Fail" });
                });
        } else {
            res.status(404).json({ message: "Find Fail" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.createByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const data = req.body;
            if (req.file) {
                data.file = req.file.filename;
                data.size = req.file.size;
                data.originalname = req.file.originalname;
                data.path = req.file.path;
                data.mimetype = req.file.mimetype;
            }
            const fileCreate = new dbName[name](data);
            await fileCreate.save();
            if (req.file) {
                res.status(201).json({
                    message: "Create Success",
                    upload: req.upload,
                    data: data,
                });
            } else {
                res.status(201).json({ message: "Create Success", data: data });
            }
        } else {
            res.status(404).json({ message: "Not Create" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
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
                data.size = req.file.size;
                data.originalname = req.file.originalname;
                data.path = req.file.path;
                data.mimetype = req.file.mimetype;
            }
            const fileUpdate = await dbName[name].findOneAndUpdate({ _id: id }, data).exec();
            if (fileUpdate?.file) {
                fs.unlinkSync(`./public/uploads/${fileUpdate.file}`, (err) => {
                    if (err) {
                        res.status(500).json({ msg: "Server Error: " + err });
                    }
                });
                fileUpdate
                    ? res.status(200).json({ message: "Update Success", data: data })
                    : res.status(404).json({ message: "Update Fail" });
            } else {
                fileUpdate
                    ? res.status(200).json({ message: "Update Success", data: data })
                    : res.status(404).json({ message: "Update Fail" });
            }
        } else {
            res.status(404).json({ message: "Update Fail" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
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
                        res.status(500).json({ msg: "Server Error: " + err });
                    }
                });
                fileRemove
                    ? res.status(200).json({ message: "Delete Success", id: id })
                    : res.status(404).json({ message: "Delete Fail" });
            } else {
                fileRemove
                    ? res.status(200).json({ message: "Delete Success", id: id })
                    : res.status(404).json({ message: "Delete Fail" });
            }
        } else {
            res.status(404).json({ message: "Delete Fail" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const name = req.params.name;
        if (dbName[name]) {
            const models = async (name) => {
                await db.db.collection(name).drop();
            };
            await models(name);
            res.status(200).json({ message: "Delete Success", db: name });
        } else {
            res.status(404).json({ message: "Delete Fail" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.lineNotify = async (req, res) => {
    try {
        const message = req.query.message || req.body.message;
        if (message !== undefined) {
            const url = "https://notify-api.line.me/api/notify";
            const method = "POST";
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${config.line_token}`,
            };
            const body = `message=${message}`;
            await fetch(url, { method, headers, body })
                .then((response) => response.json())
                .then((data) => res.status(201).json("Send Success", data))
                .catch((err) => res.status(500).json({ message: "Not Found", err: err }));
        } else {
            res.status(404).json({ message: "Not Found please enter message" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};
