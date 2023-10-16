const {config} = require("../bin/db.config");
exports.lineNotify = async (req, res, next) => {
    try {
        const message = req.query.message || req.body.message;
        if (message !== undefined) {
            const url = "https://notify-api.line.me/api/notify";
            const method = "POST";
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${config.line_token}`,
            };
            const body = `message=${message.replace(/ /g, "%20")}`;

            const lineNotify = await fetch(url, { method, headers, body });
            const data = await lineNotify.json();
            res.status(200).json(data);
            
        } else throw next({ statusCode: 404, message: "Not Found enter message" });
    } catch (err) {
        next(err);
    }
};
