const visits = require("../models/Visit");

exports.visitUpdate = async (req, res, next) => {
    try {
        const url = req.url;
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
        const visit = await visits.findOne({ url: url });
        if (visit) {
            await visits.updateOne(
                { url: url },
                { $inc: { counter: 1 } },
                { $set: { ip: ip } },
                { new: true }
            );
            next();
        } else {
            await visits.create({ url: url, counter: 1, ip: ip });
            next();
        }
    } catch (err) {
        console.log("visitUpdate error: ", err);
    }
};
