const jwt = require("jsonwebtoken");
// const db = require("../models");
const config = require("../config/auth.config");

exports.auth = async (req, res, next) => {
    try {
        const token = req?.headers["authtoken"];
        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ msg: "Token is not valid" });
            }
            req.user = decoded.user;
            next();
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.authWs = async (socket, next) => {
    try {
        socket.on("authenticate", async ({token}) => {
            // const token = req?.authtoken;
            if (!token) {
                return socket.emit("authenticated", { msg: "No token, authorization denied" });
            }
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return socket.emit("authenticated", { msg: "Token is not valid" });
                }
                socket.emit("authenticated", decoded.user );
                // next();
            });
        });
    } catch (err) {
        socket.emit("authenticated", { msg: "Server Error: " + err });
    }
};
