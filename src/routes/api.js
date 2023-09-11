const mongoose = require("../services/mongoose.service").mongoose;
const datatests = require("../api/models/Datatest");
const products = require("../api/models/Product");
const visits = require("../api/models/Visit");
const users = require("../api/models/Users");

module.exports = (app) => {
    const nameDb = {
        users: "users",
        datatests: "datatests",
        products: "products",
        visits: "visits",
    };
    const db = mongoose.connection;
    app.get("/api", async (req, res) => {
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
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error", err);
        }
    });

    app.get("/api/:name", async (req, res) => {
        const name = req.params.name;
        if (nameDb[name]) {
            const data = await db.db.collection(name).find({}).toArray();
            res.status(200).send(data);
        } else {
            res.status(404).send("Not Found");
        }
    });

    app.get("/api/:name/:id", async (req, res) => {
        const name = req.params.name;
        if (nameDb[name]) {
            const id = req.params.id;
            const models = (name) => {
                switch (name) {
                    case "users":
                        return users.findById(id);
                    case "datatests":
                        return datatests.findById(id);
                    case "products":
                        return products.findById(id);
                    case "visits":
                        return visits.findById(id);
                    default:
                        return db.db.collection(name).find({}).toArray();
                }
            };
            res.status(200).send(await models(name));
        } else {
            res.status(404).send("Not Found");
        }
    });

    app.post("/api/:name", async (req, res) => {
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
                        default:
                            return db.db.collection(name).insertOne(data);
                    }
                };
                res.status(201).send(await models(name));
            } else {
                res.status(404).send("Not Found");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error", err);
        }
    });

    app.put("/api/:name/:id", async (req, res) => {
        try {
            const name = req.params.name;
            if (nameDb[name]) {
                const data = req.body;
                const id = req.params.id;
                const models = async (name) => {
                    switch (name) {
                        case "users":
                            const user = await users.findByIdAndUpdate(id, data, {
                                new: true,
                            });
                            return user;
                        case "datatests":
                            const datatest = await datatests.findByIdAndUpdate(id, data, {
                                new: true,
                            });
                            return datatest;
                        case "products": 
                            const product = await products.findByIdAndUpdate(id, data, {
                                new: true,
                            });
                            return product;
                        case "visits":
                            const visit = await visits.findByIdAndUpdate(id, data, {
                                new: true,
                            });
                            return visit;
                        default:
                            return db.db.collection(name).updateOne({ _id: id }, { $set: data });

                        }
                };
                res.status(200).send(await models(name));
            } else {
                res.status(404).send("Not Found");
            } 
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error", err);
        }
    });

    app.delete("/api/:name/:id", async (req, res) => {
        try {
            const name = req.params.name;
            if (nameDb[name]) {
                const id = req.params.id;
                const models = async (name) => {
                    switch (name) {
                        case "users":
                            const user = await users.findByIdAndDelete(id);
                            return user;
                        case "datatests":
                            const datatest = await datatests.findByIdAndDelete(id);
                            return datatest;
                        case "products":
                            const product = await products.findByIdAndDelete(id);
                            return product;
                        case "visits":
                            const visit = await visits.findByIdAndDelete(id);
                            return visit;
                        default:
                            return db.db.collection(name).deleteOne({ _id: id });
                    }
                };
                res.status(204).send(await models(name));
            } else {
                res.status(404).send("Not Found");
            } 
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error", err);
        } 
    });

    app.delete("/api/:name/del", async (req, res) => {
        try {
            const name = req.params.name;
            if (nameDb[name]) {
                const models = async (name) => {
                    switch (name) {
                        case "users":
                            const user = await users.deleteMany({});
                            return user;
                        case "datatests":
                            const datatest = await datatests.deleteMany({});
                            return datatest;
                        case "products":
                            const product = await products.deleteMany({});
                            return product;
                        case "visits":
                            const visit = await visits.deleteMany({});
                            return visit;
                        default:
                            return db.db.collection(name).deleteMany({});
                    }
                };
                res.status(204).send(await models(name));
            } else {
                res.status(404).send("Not Found");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error", err);
        }
    });
};
