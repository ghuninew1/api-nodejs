const mongoose = require("../../services/mongoose.service").mongoose;
const datatests = require("../models/Datatest");
const products = require("../models/Product");
const visits = require("../models/Visit");
const users = require("../models/Users");
const hostips = require("../models/HostIP");
const fs = require("fs");

const dbName = {
    users: users,
    datatests: datatests,
    products: products,
    visits: visits,
    hostips: hostips,
};
const db = mongoose.connection;
exports.findAll = async (req, res) => {
    try {
        const collections = await mongoose.connections[0].collections;
        const create_atModel = await mongoose.connection.db.listCollections().toArray();
        const result = Object.keys(collections).map((data, idx) => {
            const name = Object.keys(collections)[idx].split("_")[0];
            const create_at = create_atModel.find((data) => data.name === name);
            return {
                name: data.split("_")[0],
                url:
                    req.protocol +
                    "://" +
                    req.get("host") +
                    req.originalUrl +
                    "/" +
                    data.split("_")[0],
                length: data.split("_")[0].length,
                create_at: create_at ? create_at : null,
            };
        });
        res.status(200).json(result);
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
                fs.unlinkSync(`./uploads/${fileUpdate.file}`, (err) => {
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
                fs.unlinkSync(`./uploads/${fileRemove.file}`, (err) => {
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
