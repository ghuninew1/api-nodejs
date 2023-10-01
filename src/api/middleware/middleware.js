// Desc: Middleware for all routes
exports.middleware = async (req, res, next) => {
    try {
        res.header("X-powered-by", "GhuniNew");
        res.header("X-Server-IP", req.ip || req.ips);
        res.header("X-Server-Host", req.hostname);
        next();
    } catch (err) {
        res.status(500).json({ msg: "Server Error: " + err });
    }
};
