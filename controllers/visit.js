const db = require("../models");
const Visits = db.visit;

exports.visitPageView = async (req, res) => {
    try {
        const url = req.query.url || req.body.url;
        const ip = req.query.ip || req.body.ip;
        const show = req.query.show || req.body.show;

        if (url || ip) {
            if (url) {
                const visit = await Visits.findOne({ url: url });
                const visiturl = await Visits.find({ url: url });
                if (visit) {
                    res.status(200).json({
                        url: url ? url : "",
                        counter: visiturl?.length ? visiturl.length : 0,
                        ip: visit?.ip ? visit.ip : [],
                        visitAll: show === "all" && visitAll,
                        visitUrl: visiturl ? visiturl : [],
                    });
                } else {
                    res.status(404).json( "Not Found" );
                }
            } else if (ip) {
                const visit = await Visits.findOne({ ip: ip });
                const visitip = await Visits.find({ ip: ip });
                res.status(200).json({
                    url: visit?.url ? visit.url : "",
                    counter: visitip?.length,
                    ip: visit.ip ? visit?.ip : [],
                    visitAll: show === "all" && visitAll,
                    visitIp: visitip ? visitip : [],
                });
            } else {
                res.status(404).json( "Not Found" );
            }
        } else {
            const visitAll = await Visits.find({});
            const visitUrl = visitAll.map((item) => item?.url);
            const visitIp = visitAll.map((item) => item?.ip);
            const counterAll = visitAll.reduce((acc, item) => acc + item.counter, 0);
            const visitAllIp = visitAll.reduce((acc, item) => {
                if (acc[item.ip]) {
                    acc[item.ip] += item.counter;
                } else {
                    acc[item.ip] = item.counter;
                }
                return acc;
            }, {});
            const visitAllUrl = visitAll.reduce((acc, item) => {
                if (acc[item.url]) {
                    acc[item.url] += item.counter;
                } else {
                    acc[item.url] = item.counter;
                }
                return acc;
            }, {});
            res.status(200).json({
                counterAll: counterAll ? counterAll : 0,
                data: show === "all" && visitAll,
                visitUrl: visitUrl ? visitUrl : [],
                visitIp: visitIp ? visitIp : [],
                visitAllIp: visitAllIp ? visitAllIp : [],
                visitAllUrl: visitAllUrl ? visitAllUrl : [],
            });
        }
    } catch (err) {
        return res.status(500).json( "Server Error: " + err + " " + err.message);
    }
};

exports.visitPageCreate = async (req, res) => {
    try {
        const url = req.query.url || req.body.url;
        const ips = req.query.ip || req.body.ip;
        if (url && !ips) {
            const dns = require("dns");
            const { promisify } = require("util");
            const dnsLookup = promisify(dns.lookup);
            const ip = await dnsLookup(url);
            const visit = await Visits.findOne({ url: url });
            if (ip.address === visit?.ip) {
                await Visits.updateOne(
                    { url: url },
                    { $inc: { counter: 1 }, $set: { ip: ip.address }, new: true }
                );
                return res.status(200).json( "Update Success" );
            } else {
                const visitIp = await Visits.findOne({ ip: ip.address });
                if (ip.address === visitIp?.ip && visit) {
                    await Visits.updateOne(
                        { ip: ip.address },
                        { $inc: { counter: 1 }, $set: { url: url }, new: true }
                    );
                    return res.status(200).json( "Update Success" );
                } else {
                    const visitTs = new Visits({
                        url: url,
                        counter: 1,
                        ip: ip.address,
                    });
                    await visitTs.save();
                    return res.status(201).json( "Create Success" );
                }
            }
        } else if (!url && ips) {
            const ip = ips.split(",");
            const visit = await Visits.findOne({ ip: ip });
            if (visit) {
                await Visits.updateOne(
                    { ip: ip },
                    { $inc: { counter: 1 }, $set: { url: url }, new: true }
                );
                return res.status(200).json( "Update Success" );
            } else {
                const visitTs = new Visits({
                    url: url,
                    counter: 1,
                    ip: ip,
                });
                await visitTs.save();
                return res.status(201).json( "Create Success" );
            }
        } else {
            return res.status(404).json( "Not Found" );
        }
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};
