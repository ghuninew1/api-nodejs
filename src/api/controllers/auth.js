const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        let user = await db.user.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: "User already exists: " + user.username });
        }
        const salt = await bcrypt.genSalt(10);
        user = new db.user({
            username,
            password,
            email,
        });

        user.password = await bcrypt.hash(password, salt);
        await user.save();
        let payload = {
            user: user,
        };
        user ? res.status(201).json(payload) : res.status(400).json({ msg: "User not found" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await db.user.findOneAndUpdate({ username }, { new: true });
        if (user) {
            const isMatch = bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials Password" });
            }
            let payload = {
                user: {
                    username: user.username,
                },
            };
            if (user.tokens.length > 0) {
                //check if token is expired
                const token = user.tokens[0];
                const isExpired = Date.now() > token.expires;
                if (isExpired) {
                    user.tokens = [];
                    user.save();
                    jwt.sign(
                        payload,
                        "gnewsecret",
                        {
                            expiresIn: "1d",
                            allowInsecureKeySizes: true,
                            algorithm: "HS512",
                        },
                        (err, token) => {
                            if (err) throw err;
                            user.tokens = user.tokens.concat({
                                token,
                                expires: Date.now() + 86400000,
                            });
                            user.save();
                            res.status(200).json({
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                tokens: {
                                    token: token,
                                    expires: Date.now() + 86400000,
                                },
                            });
                        }
                    );
                } else {
                    return res.status(200).json({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        tokens: {
                            token: token.token,
                            expires: token.expires,
                        },
                    });
                }
            } else {
                jwt.sign(
                    payload,
                    "gnewsecret",
                    {
                        expiresIn: "1d",
                        allowInsecureKeySizes: true,
                        algorithm: "HS512",
                    },
                    (err, token) => {
                        if (err) throw err;
                        user.tokens = user.tokens.concat({
                            token,
                            expires: Date.now() + 86400000,
                        });
                        user.save();
                        res.status(200).json({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            tokens: {
                                token: token,
                                expires: Date.now() + 86400000,
                            },
                        });
                    }
                );
            }
        } else {
            return res.status(400).json({ msg: "Invalid Credentials User not found" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};


exports.currentUser = async (req, res) => {
    try {
        const user = await db.user.findOne({ username: req.user.username }).select("-password").exec();
        console.log(req.user);
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};
