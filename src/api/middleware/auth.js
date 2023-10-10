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

