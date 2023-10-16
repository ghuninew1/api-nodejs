const fs = require("fs");
const mongoose = require("mongoose");
const db = require("../models");

exports.findAll = async (req, res, next) => {
    try {
        const dbAll = await mongoose.connection.db.listCollections().toArray();
        const data = dbAll.map((item) => {
            const name = item.name && item.name;
            const type = item.type && item.type;
            const timeseries = item.options.timeseries && item.options.timeseries;
            return (item = { name, type, timeseries });
        });

        res.status(200).json({
            data,
            count: data.length,
        });
    } catch (err) {
        next(err);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const name = req.params.name;
        let limit = parseInt(req.query.limit);
        const sort = req.query.sort;
        const order = req.query.order;
        !name && next({ statusCode: 404, message: "Not Found please enter name" });

        const data = await db[name].find().sort({ [sort]: order === "asc" ? 1 : -1 }).limit(limit ? (limit > 1 ? limit : 0) : 20).exec();
            res.status(200).json(data)
    } catch (err) {
        next(err);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const name = req.params.name;
        const id = req.params.id;
        !name || !id && next({ statusCode: 404, message: "Not Found please enter name and id" });
        const data = await db[name].findOne({ _id: id }).exec();
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.createByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        !name || !req.body && next({ statusCode: 404, message: "Not Found please enter name and body" });
        const data = req.body;
        if (req?.file) {
            data.file = req.file.filename && req.file.filename;
        }
        const fileCreate = new db[name](data);
        await fileCreate.save()

        res.status(201).json(fileCreate);
    } catch (err) {
        next(err);
    }
};

exports.updateByid = async (req, res, next) => {
    try {
        const name = req.params.name;
        const id = req.params.id;
        !name || !id && next({ statusCode: 404, message: "Not Found please enter name and id" });
        const data = req.body;
        if (req?.file) {
            data.file = req.file.filename && req.file.filename;
        }
        const fileUpdate = await db[name].findOneAndUpdate({ _id: id }, data);
        if (fileUpdate?.file) {
            fs.unlinkSync(`./public/uploads/${fileUpdate.file}`, (err) => {
                if (err) throw next({ statusCode: 500, message: "File Error: " + err });
                res.status(200).json(data);
            });
        }
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.deleteByid = async (req, res, next) => {
    try {
        const name = req.params.name;
        const id = req.params.id;
        !name || !id && next({ statusCode: 404, message: "Not Found please enter name and id" });
        const fileRemove = await db[name].findOneAndDelete({ _id: id }).exec();
        if (fileRemove?.file) {
            fs.unlinkSync(`./public/uploads/${fileRemove.file}`, (err) => {
                if (err) throw next({ statusCode: 500, message: "File Error: " + err });
            });
            res.status(200).json( "Delete Success "+ id );
        }
        res.status(200).json( "Delete Success" + id );
    } catch (err) {
        next(err);
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const name = req.params.name;
        if (!name) throw next({ statusCode: 404, message: "Not Found please enter name" });
        const modelDelete = await db[name].deleteMany({}).exec();
        if (!modelDelete && modelDelete.deletedCount === 0) throw next({ statusCode: 404, message: "Not Found not delete" });
        else res.status(200).json( "Delete Success" );
        
    } catch (err) {
        next(err);
    }
};
