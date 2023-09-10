const mongoose = require("../services/mongoose.service").mongoose;
const Datatest = require("./models/Datatest");
const Product = require("./models/Product");
const Visit = require("./models/Visit");

module.exports = app =>  {
    app.get("/db", async (req, res) => {
        const collections = mongoose.connections[0].collections;
        const result = Object.keys(collections).map((data,idx) => {
            return {
                id: idx,
                name: data.split("_")[0],
                url: req.protocol + '://' + req.get('host') + req.originalUrl  +'/'+ data.split("_")[0],
                length: data.split("_")[0].length,
                type: data.split("_")[0].length > 1 ? "collection" : "database",
                timestamp: new Date().toLocaleString('th-TH'),
                parent: data.split("_")[0].length > 1 ? data.split("_")[0].substring(0, data.split("_")[0].length - 1) : null
            }
        })
        res.status(200).send(result);
    });

    app.get("/db/:name", async (req, res) => {
        const name = req.params.name;
        if (name === Datatest.collection.collectionName) {
            const data = await Datatest.find({});
            res.status(200).send(data);     
        } 
        if (name === Product.collection.collectionName) {
            const data = await Product.find({});
            res.status(200).send(data);
        }
        if (name === Visit.collection.collectionName) {
            const data = await Visit.find({});
            res.status(200).send(data);
        }
    } );

    app.get("/db/:name/:id", async (req, res) => {
        const name = req.params.name;
        const id = req.params.id;
        const data = await mongoose.connection.db.collection(name).findOne({_id: id});
        res.status(200).send(data);     
    } );

    app.post("/db/:name", async (req, res) => {
        const name = req.params.name;
        const data = req.body;
        const result = await mongoose.connection.db.collection(name).insertOne(data);
        res.status(201).send(result);     
    } );

    app.put("/db/:name/:id", async (req, res) => {
        const name = req.params.name;
        const id = req.params.id;
        const data = req.body;
        const result = await mongoose.connection.db.collection(name).updateOne({_id: id}, {$set: data});
        res.status(202).send(result);
    } );

    app.delete("/db/:name/:id", async (req, res) => {
        const name = req.params.name;
        const id = req.params.id;
        const result = await mongoose.connection.db.collection(name).deleteOne({_id: id});
        res.status(204).send(result);
    } );

    app.delete("/db/:name", async (req, res) => {
        const name = req.params.name;
        const result = await mongoose.connection.db.collection(name).deleteMany({});
        res.status(204).send(result);
    } );
}; 