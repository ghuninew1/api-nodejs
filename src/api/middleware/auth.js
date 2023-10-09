const jwt = require("jsonwebtoken");
// const db = require("../models");
const config = require("../config/auth.config");

exports.auth = async (req, res, next) => {
    try {
        const token = req?.headers["authtoken"];
        if (!token) {
            return res.status(401).json( "No token, authorization denied" );
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(403).json( "Token is not valid" );
            }
            req.user = decoded?.user;
            next();
        });
    } catch (err) {
        res.status(500).json( "Server Error: " + err + " " + err.message);
    }
};

exports.authWs = async (socket) => {
    try {
        socket.on("authenticate", ({token}) => {
            // const token = req?.authtoken;
            if (!token) {
                return console.log("No token, authorization denied");
            }
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return console.log("Token is not valid");
                }
                socket.emit("authenticated", decoded.user );
            });
        });
    } catch (err) {
        console.log("Server Error: " + err);
    }
};
