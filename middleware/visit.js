const db = require("../models");
const visits = db.visit;

exports.visitUpdate = async (req, res, next) => {
    try {
        const url = req.url;
        const ips = req?.ip || req.connection.remoteAddress
        const ip = ips?.split(":").pop();
        const visit = await visits.findOne({ url: url });
        
        if (visit && ip === visit?.ip) {
            await visits.updateOne(
                { url: url },
                { $inc: { counter: 1 }, $set: { ip: ip }, new: true }
            );
            next();
        } else {
            const visitip = await visits?.findOne({ ip: ip });
            if (ip === visitip?.ip && visit) {
                await visits.updateOne(
                    { ip: ip },
                    { $inc: { counter: 1 }, $set: { url: url }, new: true }
                );
                next();
            } else {
                const visitTs = new visits({
                    url: url,
                    counter: 1,
                    ip: ip,
                });
                await visitTs.save();
                next();
            }
        }
    } catch (err) {
        next(err);    
    }
};
