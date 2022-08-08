const nodemailer = require('nodemailer');
// const { options } = require('../app');

const sendEmail = async options => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2) define email options
  const mailOptions = {
    from: 'Vishnu Sharma <vishnujr092@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html
  };
  // 3) Send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
