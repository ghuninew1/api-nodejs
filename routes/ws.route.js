const router = require("express").Router();

router.get("/ws", (req, res) => {
    res.status(200).render("ws");
});

router.get("/", (req, res) => {
    res.status(200).json({
        msg: "Welcome to GhuniNew API",
        ip: req.ip,
        host: req.hostname,
        protocol: req.protocol,
        session: req.session,
    })
});

module.exports = router;