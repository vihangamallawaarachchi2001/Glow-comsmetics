// services/emailService.js
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

let transporter = nodemailer.createTransport(emailConfig.smtp);

/**
 * Sends an email using Nodemailer
 */
const sendEmail = async ({ to, subject, text }) => {
    const mailOptions = {
        from: emailConfig.from,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error.message);
    }
};

module.exports = {
    sendEmail
};