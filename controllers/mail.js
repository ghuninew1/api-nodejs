const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper
async function main(to, subject, text, html) {
    // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
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
        from: '"Fred Foo 👻" <xxxx@gmail.com>', // อีเมลผู้ส่ง
        to: to, // อีเมลผู้รับ (ถ้าหลายๆ คน ให้ใช้ , เป็นตัวคั่น)
        subject: subject, // หัวข้ออีเมล
        text: text, // plain text body
        html: html, // html body
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
