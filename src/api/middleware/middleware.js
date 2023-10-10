// Desc: Middleware for all routes
exports.middleware = (req, res, next) => {
    try {
        res.header("X-powered-by", "GhuniNew");
        res.header("X-Server-IP", req?.ip || req.connection?.remoteAddress);
        next();
    } catch (err) {
        res.status(500).json( "Server Error: " + err );
    }
};
