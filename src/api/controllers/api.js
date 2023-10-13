const fs = require("fs");
const mongoose = require("mongoose");
const db = require("../models");

exports.findAll = async (req, res) => {
    try {
        const dbAll = await mongoose.connection.db.listCollections().toArray();
        const data = dbAll.map((item) => {
            const name = item.name && item.name;
            const type = item.type && item.type;
            const timeseries = item.options.timeseries && item.options.timeseries;
            return (item = { name, type, timeseries });
        });

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json("Server Error: " + err + " " + err.message);
    }
};

exports.findOne = async (req, res) => {
    try {
        const name = req.params.name;
        let limit = parseInt(req.query.limit);
        const sort = req.query.sort;
        const order = req.query.order;
        if (name) {
            const data = await db[name]
                .find()
                .sort({ [sort]: order === "asc" ? 1 : -1 })
                .limit(limit ? (limit > 1 ? limit : 0) : 20)
                .exec();
            res.status(200).json(data);
        } else {
            res.status(404).json( "Enter name" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err + " " + err.message);
    }
};

exports.findById = async (req, res) => {
    try {
        const name = req.params.name;
        const id = req.params.id;
        if (name && id) {
            const data = await db[name].findOne({ _id: id }).exec();
            res.status(200).json(data);
        } else {
            res.status(404).json( "Enter name and id" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err + " " + err.message);
    }
};

exports.createByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (name) {
            const data = req.body;
            if (req?.file) {
                data.file = req.file.filename && req.file.filename;
                // data.file_size = req.file.size && req.file.size;
                // data.file_originalname = req.file.originalname && req.file.originalname;
                // data.file_path = req.file.path && req.file.path;
                // data.file_mimetype = req.file.mimetype && req.file.mimetype;
            }
            const fileCreate = new db[name](data);
            await fileCreate.save()

            res.status(201).json(fileCreate);

        } else {
            res.status(404).json( "Enter name" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};

exports.updateByid = async (req, res) => {
    try {
        const name = req.params.name;
        const id = req.params.id;
        if (name && id) {
            const data = req.body;
            if (req?.file) {
                data.file = req.file.filename && req.file.filename;
                // data.file_size = req.file.size && req.file.size;
                // data.file_originalname = req.file.originalname && req.file.originalname;
                // data.file_path = req.file.path && req.file.path;
                // data.file_mimetype = req.file.mimetype && req.file.mimetype;
            }
            const fileUpdate = await db[name].findOneAndUpdate({ _id: id }, data).exec();
            if (fileUpdate?.file) {
                fs.unlinkSync(`./public/uploads/${fileUpdate.file}`, (err) => {
                    if (err) {
                        res.status(500).json( "File Error: " + err );
                    }
                    res.status(200).json(data);
                });
            }
            res.status(200).json(data);
        } else {
            res.status(404).json( "Enter name and id" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};

exports.deleteByid = async (req, res) => {
    try {
        const name = req.params.name;
        const id = req.params.id;
        if (name && id) {
            const fileRemove = await db[name].findOneAndDelete({ _id: id }).exec();
            if (fileRemove?.file) {
                fs.unlinkSync(`./public/uploads/${fileRemove.file}`, (err) => {
                    if (err) {
                        res.status(500).json( "File Error: " + err );
                    }
                });
                res.status(200).json( "Delete Success "+ id );
            }
            res.status(200).json( "Delete Success" + id );
        } else {
            res.status(404).json( "Enter name and id" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const name = req.params.name;
        if (name) {
            const modelDelete = await db[name].deleteMany({}).exec();
            if (modelDelete && modelDelete.deletedCount > 0) {
                res.status(200).json( "Delete Success" );
            } else {
                res.status(404).json( "Delete Fail" );
            }
        } else {
            res.status(404).json( "Enter name" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
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
                .catch((err) => res.status(500).json( "Not Found", err ));
        } else {
            return res.status(404).json( "Not Found please enter message" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};
