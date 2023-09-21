const jwt = require("jsonwebtoken");
const Tokens = require("../models/Token");
const bcrypt = require("bcryptjs");

exports.auth = async (req, res, next) => {
    try {
        const token = req.headers["authtoken"];
        const name = req.headers["token"];
        if (!token && !name) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        } 
        if (name) {
            let user = await Tokens.findOneAndUpdate({ name }, { new: true });
            const isMatch = bcrypt.compare(name, user.token);
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials Password" });
            } else {
                next();
            }
        }
        else {
            const decoded = jwt.verify(token, "gnewsecret");
            req.user = decoded.user;
            next();
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};
