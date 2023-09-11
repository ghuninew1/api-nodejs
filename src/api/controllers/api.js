const mongoose = require("../../services/mongoose.service").mongoose;
const datatests = require("../models/Datatest");
const products = require("../models/Product");
const visits = require("../models/Visit");
const users = require("../models/Users");
const hostips = require("../models/HostIP");

const nameDb = {
    users: "users",
    datatests: "datatests",
    products: "products",
    visits: "visits",
    hostips: "hostips",
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
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.findOne = async (req, res) => {
    const name = req.params.name;
    if (nameDb[name]) {
        const data = await db.db.collection(name).find({}).toArray();
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "Not Found" });
    }
};

exports.findById = async (req, res) => {
    try {
        const name = req.params.name;
        if (nameDb[name]) {
            const id = req.params.id;
            const models = (name) => {
                switch (name) {
                    case "users":
                        return users.findById(id).exec();
                    case "datatests":
                        return datatests.findById(id).exec();
                    case "products":
                        return products.findById(id).exec();
                    case "visits":
                        return visits.findById(id).exec();
                    case "hostips":
                        return hostips.findById(id).exec();
                    default:
                        return db.db.collection(name).find({}).toArray();
                }
            };
            res.status(200).json(await models(name));
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.createByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (nameDb[name]) {
            const data = req.body;
            const models = async (name) => {
                switch (name) {
                    case "users":
                        const user = new users(data);
                        await user.save();
                        return user;
                    case "datatests":
                        const datatest = new datatests(data);
                        await datatest.save();
                        return datatest;
                    case "products":
                        const product = new products(data);
                        await product.save();
                        return product;
                    case "visits":
                        const visit = new visits(data);
                        await visit.save();
                        return visit;
                    case "hostips":
                        const hostip = new hostips(data);
                        await hostip.save();
                        return hostip;
                    default:
                        return db.db.collection(name).insertOne(data);
                }
            };
            res.status(201).json({ message: "Create Success", data: await models(name) });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateByid = async (req, res) => {
    try {
        const name = req.params.name;
        if (nameDb[name]) {
            const data = req.body;
            const id = req.params.id;
            const models = async (name) => {
                switch (name) {
                    case "users":
                        const user = await users
                            .findByIdAndUpdate(id, data, {
                                new: true,
                            })
                            .exec();
                        return user;
                    case "datatests":
                        const datatest = await datatests
                            .findByIdAndUpdate(id, data, {
                                new: true,
                            })
                            .exec();
                        return datatest;
                    case "products":
                        const product = await products
                            .findByIdAndUpdate(id, data, {
                                new: true,
                            })
                            .exec();
                        return product;
                    case "visits":
                        const visit = await visits
                            .findByIdAndUpdate(id, data, {
                                new: true,
                            })
                            .exec();
                        return visit;
                    case "hostips":
                        const hostip = await hostips
                            .findByIdAndUpdate(id, data, {
                                new: true,
                            })
                            .exec();
                        return hostip;
                    default:
                        return db.db.collection(name).updateOne({ _id: id }, { $set: data });
                }
            };
            res.status(200).json({ message: "Update Success", data: await models(name) });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteByid = async (req, res) => {
    try {
        const name = req.params.name;
        if (nameDb[name]) {
            const id = req.params.id;
            const models = async (name) => {
                switch (name) {
                    case "users":
                        const user = await users.findByIdAndDelete(id).exec();
                        return user;
                    case "datatests":
                        const datatest = await datatests.findByIdAndDelete(id).exec();
                        return datatest;
                    case "products":
                        const product = await products.findByIdAndDelete(id).exec();
                        return product;
                    case "visits":
                        const visit = await visits.findByIdAndDelete(id).exec();
                        return visit;
                    case "hostips":
                        const hostip = await hostips.findByIdAndDelete(id).exec();
                        return hostip;
                    default:
                        return db.db.collection(name).deleteOne({ _id: id });
                }
            };
            res.status(204).json({ message: "Delete Success", data: await models(name) });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const name = req.params.name;
        if (nameDb[name]) {
            const models = async (name) => {
                switch (name) {
                    case "users":
                        const user = await users.deleteMany({}).exec();
                        return user;
                    case "datatests":
                        const datatest = await datatests.deleteMany({}).exec();
                        return datatest;
                    case "products":
                        const product = await products.deleteMany({}).exec();
                        return product;
                    case "visits":
                        const visit = await visits.deleteMany({}).exec();
                        return visit;
                    case "hostips":
                        const hostip = await hostips.deleteMany({}).exec();
                        return hostip;
                    default:
                        return db.db.collection(name).deleteMany({});
                }
            };
            res.status(204).json({ message: "Delete All", data: await models(name) });
        } else {
            res.status(404).json({ message: "Not Found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
