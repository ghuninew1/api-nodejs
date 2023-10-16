const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {secret, option} = require("../bin/auth.config");

exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        !username || !password || !email && next({ statusCode: 404, message: "Missing fields" });
        let user = await db.users.findOne({ username });
        user && next({ statusCode: 400, message: "User already exists" });
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
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        !username || !password && next({ statusCode: 404, message: "Missing fields" });
        const user = await db.users.findOneAndUpdate({ username }, { new: true });
        if (user && user.enabled) {
            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) throw next({ statusCode: 400, message: "Invalid Credentials" });
            let payload = {
                user: {
                    username: user.username,
                    email: user.email,
                    token: user.tokens[0]?.token,
                    expires: user.tokens[0]?.expires,
                },
            };
            if (user.tokens.length > 0) {
                const token = user.tokens[0];
                if (Date.now() > token.expires) {
                    user.tokens = [];
                    await user.save();
                    jwt.sign(payload, secret, option, async (err, token) => {
                        if (err) throw next(err);
                        user.tokens = user.tokens.concat({
                            token,
                            expires: Date.now() + 86400000,
                        });
                        await user.save();
                        console.log("token expired");
                        res.status(200).json(payload.user);
                    });
                } else {
                    console.log("token not expired");
                    res.status(200).json(payload.user);
                }
            } else {
                jwt.sign(payload, secret, option, async (err, token) => {
                    if (err) throw next(err);
                    user.tokens = user.tokens.concat({
                        token,
                        expires: Date.now() + 86400000,
                    });
                    await user.save();
                    console.log("not token");

                    res.status(200).json({
                        username: user.username,
                        email: user.email,
                        token: user.tokens[0]?.token,
                        expires: user.tokens[0]?.expires,
                    });
                });
            }
        } else throw next({ statusCode: 400, message: "Invalid Credentials" });
    } catch (err) {
        next(err);
    }
};

exports.currentUser = async (req, res, next) => {
    try {
        const user = await db.users
            .findOne({ username: req.user.username })
            .select("-password")
            .exec();
        !user && next({ statusCode: 404, message: "User not found" });
        res.status(200).json({
            username: user.username,
            email: user.email,
            role_id: user.roles[0]?.id,
            token: user.tokens[0]?.token,
            expires: user.tokens[0]?.expires,
            updatedAt: user.updatedAt,
        });
    } catch (err) {
        next(err);
    }
};

exports.confirmUser = async (req, res, next) => {
    try {
        const username = req.query.username;
        !username && next({ statusCode: 404, message: "Missing fields" });
        const user = await db.users.findOneAndUpdate({ username: username }, { new: true });

        !user && next({ statusCode: 404, message: "User not found" });
        if (user.enabled === false) {
            user.enabled = true;
            await user.save();
            res.status(200).json({
                enabled: true,
                username: user.username,
            });
        } else {
            user.enabled = false;
            await user.save();
            res.status(200).json({
                enabled: false,
                username: user.username,
            });
        }
    } catch (err) {
        next(err);
    }
};
