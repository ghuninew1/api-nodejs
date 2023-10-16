const jwt = require("jsonwebtoken");
// const db = require("../models");
const { secret } = require("../bin/auth.config");

exports.auth = (req, res, next) => {
    try {
        const token = req.headers["authtoken"];
        !token && next({ statusCode: 403, message: "No token provided" });
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw next({ statusCode: 401, message: "Unauthorized! Access Token was expired!" });
                }
                throw next({ statusCode: 401, message: "Unauthorized!" });
            }
            req.user = decoded?.user;
            next();
        });
    } catch (err) {
        next(err);
    }
};

