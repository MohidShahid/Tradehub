const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/ErrorHandler")
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "gmail",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const emailService = async(reciever, subject, message)=>{
try {
  const info = await transporter.sendMail({
    from: 'mohid.fantasy@gmail.com', // sender address
    to: reciever, // list of recipients
    subject: subject, // subject line
    text: message, // plain text body
    // html: "", // HTML body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
}


module.exports = {emailService}
