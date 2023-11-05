const nodemailer = require("nodemailer");

async function main(to, subject, text, html) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "xxxxx@gmail.com", // email user ของเรา
            pass: "xxxx", // email password
        },
    });

    let info = await transporter.sendMail({
        from: '"GhuniNew 👻" <admin@ghuninew.com>', // อีเมลผู้ส่ง
        to: to ? to : "aakanun43@gmail.com", // อีเมลผู้รับหากไม่ได้ระบุไว้
        subject: subject ? subject : "Hello ✔", // หัวข้ออีเมล
        text: text ? text : "Hello world?", // plain text body
        html: html ? html : "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
}

exports.sendMail = async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;
        if (!to || !subject || !text || !html) {
            return res.status(400).json({
                status: "fail",
                statusCode: 400,
                message: "Missing required fields: to, subject, text, html",
            });
        }
        await main(to, subject, text, html);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Send mail success",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: err.message,
        });
    }
};
