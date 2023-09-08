const mongoose = require("../services/mongoose.service").mongoose;

module.exports = app =>  {
    app.get("/api", async (req, res) => {
        const collections = mongoose.connections[0].collections;
        const names = [];

        await Object.keys(collections).forEach(function(k) {
            names.push(k);
        });
        res.status(200).send(names);     
    });

    app.get("/db", async (req, res) => {
        const collections = mongoose.connections[0].collections;
        const names = [];

        await Object.keys(collections).forEach(function(k) {
            names.push(k);
        });
        res.status(200).send(names);
    } );

    app.get("/db/:name", async (req, res) => {
        const name = req.params.name;
        const data = await mongoose.connection.db.collection(name).find({}).toArray();
        res.status(200).send(data);     
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
        res.status(200).send(result);
    } );

    app.delete("/db/:name/:id", async (req, res) => {
        const name = req.params.name;
        const id = req.params.id;
        const result = await mongoose.connection.db.collection(name).deleteOne({_id: id});
        res.status(200).send(result);
    } );

    app.delete("/db/:name", async (req, res) => {
        const name = req.params.name;
        const result = await mongoose.connection.db.collection(name).deleteMany({});
        res.status(200).send(result);
    } );
}; 