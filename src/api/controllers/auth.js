const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email || !username.trim() || !password.trim() || !email.trim())
            res.status(400).json( "Please enter all fields" );
        let user = await db.users.findOne({ username });
        if (user) {
            res.status(400).json( "User already exists: " + user.username );
        }
        const salt = await bcrypt.genSalt(10);
        user = new db.users({
            username,
            password,
            email,
            roles: [
                {
                    role: "user",
                    id: 100,
                },
            ],
        });
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        user = user.toObject();
        delete user.password;
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await db.users.findOneAndUpdate({ username }, { new: true });
        if (user && user.enabled) {
            const isMatch = bcrypt.compare(password, user.password);

            if (!isMatch) {
                res.status(404).json( "Invalid Credentials Password" );
            }
            let payload = {
                user: {
                    username: user.username,
                    roles: user.roles,
                },
            };
            if (user.tokens.length > 0) {
                //check if token is expired
                const token = user.tokens[0];
                const isExpired = Date.now() > token.expires;
                if (isExpired) {
                    user.tokens = [];
                    await user.save();
                    jwt.sign(
                        payload,
                        "gnewsecret",
                        {
                            expiresIn: "1d",
                            allowInsecureKeySizes: true,
                            algorithm: "HS512",
                        },
                        async (err, token) => {
                            if (err) throw err;
                            user.tokens = user.tokens.concat({
                                token,
                                expires: Date.now() + 86400000,
                            });
                            await user.save();
                            user = user.toObject();
                            delete user.password;
                            res.status(200).json(user);
                        }
                    );
                } else {
                    user = user.toObject();
                    delete user.password;
                    res.status(200).json(user);
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
                    async (err, token) => {
                        if (err) throw err;
                        user.tokens = user.tokens.concat({
                            token,
                            expires: Date.now() + 86400000,
                        });
                        await user.save();
                        user = user.toObject();
                        delete user.password;
                        res.status(200).json(user);
                    }
                );
            }
        } else {
            res.status(404).json( "Invalid Credentials User not found" );
        }
    } catch (err) {
        res.status(500).json("Server Error: " + err );
    }
};

exports.currentUser = async (req, res) => {
    try {
        const user = await db.users
            .findOne({ username: req.user.username })
            .select("-password")
            .exec();
        if (!user) {
            res.status(404).json( "User not found" );
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};

