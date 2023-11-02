const nodemailer = require("nodemailer");
require("dotenv").config();

async function main(email, subject, text, html) {
    let transporter = nodemailer.createTransport(
        {
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true,
            transactionLog: true, // include SMTP traffic in the logs
            allowInternalNetworkInterfaces: true,
        },
        {
            from: "GhuniNew ",
            headers: {
                "X-Laziness-level": 1000, // just an example header, no need to use this
            },
        }
    );

    let message = {
        from: '"GhuniNew" <ghuninew@localhost.local>',
        to: "aakanun43@gmail.com",
        subject: subject ? subject : "test",
        text: text ? text : "test text",
        html: html ? html : "html test",
    };
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log("Error occurred. " + err.message);
            return process.exit(1);
        }

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
}
main().catch(console.error);
