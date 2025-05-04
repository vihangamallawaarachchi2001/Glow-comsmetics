// config/email.js
require('dotenv').config();

module.exports = {
    smtp: {
        host: process.env.SMTP_SERVER || "smtp-relay.brevo.com",
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_LOGIN || "vihanganethusara00@gmail.com",
            pass: process.env.SMTP_KEY || "xsmtpsib-07b76c08f70583676f2c0dbf07c1b291bf6253b8feb8b0a9658e4b8f22024284-jtbQHUdJWac096Rm"
        }
    },
    from: '"Your Store" <no-reply@store.com>'
};

// SMTP_SERVER="smtp-relay.brevo.com"
// SMTP_PORT=587
// SMTP_LOGIN="vihanganethusara00@gmail.com"
// SMTP_KEY="xsmtpsib-07b76c08f70583676f2c0dbf07c1b291bf6253b8feb8b0a9658e4b8f22024284-jtbQHUdJWac096Rm"
// SMTP_KEY_NAME="AF-assignmentName"