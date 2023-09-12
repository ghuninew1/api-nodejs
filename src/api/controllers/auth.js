const User = require("../models/Users");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, password } = req.body;
        let user = await User.findOne({ name });
        if (user) {
            return res.status(400).json({ msg: "User already exists: " + user.name });
        }
        const salt = await bcrypt.genSalt(10);
        user = new User({
            name,
            password,
        });
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg: "User Created: " + user.name});
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error: " + err });
    }
};
exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;
        let user = await User.findOneAndUpdate({ name }, { new: true });
        console.log("user", user);

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials Password" });
            }
            let payload = {
                user: {
                    name: user.name,
                },
            };
            jwt.sign(payload, "gnewsecret", { expiresIn: "1d" }, (err, token) => {
                if (err) throw err;
                res.status(200).json({ token, payload });
            });
        } else {
            return res.status(400).json({ msg: "Invalid Credentials User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" + err });
    }
};

// generate token using secret from process.env.JWT_SECRET
exports.generateToken = async (req, res) => {
    try {
        const name = req.query.token;
        let tokendb = await Token.findOne({ name });

        if (tokendb) {
            return res.status(400).json({ msg: "Invalid Credentials Token already exists" });
        } else {
            const salt = await bcrypt.genSalt(10);
            tokendb = new Token({
                name,
            });
            tokendb.token = await bcrypt.hash(name, salt);
            await tokendb.save();

            console.log("tokendb", tokendb);
            res.status(201).json({ tokendb });
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" + err });
    }
};
