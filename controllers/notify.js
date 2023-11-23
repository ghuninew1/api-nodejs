const { log } = require("console");

require("dotenv").config();

exports.lineNotify = async (req, res, next) => {
    try {
        const message = "test message send from lineNotify";
        // req.query.message || req.body.message

        if (message !== undefined && message !== "") {
            const url = "https://notify-api.line.me/api/notify";
            const method = "POST";
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${process.env.LINE_NOTIFY_TONKEN2}`,
            };
            const body = `message=${message.replace(/ /g, "%20")}`;

            const lineNotify = await fetch(url, { method, headers, body });
            const data = await lineNotify.json();

            // res.status(200).json(data);
            console.log("data: ", data);
        } else
            throw res.status(404).send({ message: "Not Found enter message" });
    } catch (err) {
        console.log("Error lineNotify: ", err);
    }
};
