const jwt = require("jsonwebtoken");
const db = require("../models");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");

exports.auth = async (req, res, next) => {
    try {
        const token = req?.headers["authtoken"];
        if (!token) {
            return res.status(403).json({ msg: "No token, authorization denied" });
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Token is not valid" });
            }
            req.user = decoded.user;
            next();
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};
