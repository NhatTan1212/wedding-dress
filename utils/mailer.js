const nodeMailer = require('nodemailer');
// const mailConfig = require('../config/mailConfig');
require('dotenv').config()

exports.sendMail = (to, subject, htmlContent) => {
    const transport = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const options = {
        from: "Website Bán Laptop",
        to: to,
        subject: subject,
        html: htmlContent
    };

    return transport.sendMail(options)
        .then(response => {
            // console.log('Email sent:', response);
            return response; // Trả về phản hồi email thành công
        })
        .catch(error => {
            console.error('Error sending email:', error);
            throw error; // Ném lỗi để xử lý bên ngoài
        });
};
