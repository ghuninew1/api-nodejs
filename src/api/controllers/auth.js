const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, password } = req.body;
        let user = await User.findOne({ name });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        user = new User({
            name,
            password,
        });
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.send("Register Success!!");
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" + err });
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
                return res.status(400).json({ msg: "Invalid Credentials" });
            }
            let payload = {
                user: {
                    name: user.name,
                },
            };
            jwt.sign(payload, "gnewsecret", { expiresIn: "1d" }, (err, token) => {
                if (err) throw err;
                res.json({ token, payload });
            });
        } else {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" + err });
    }
};
