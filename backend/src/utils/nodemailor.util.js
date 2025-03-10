import nodemailer from "nodemailer";

const emailSender = async (userEmail, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      to: userEmail,
      subject: subject,
      text: message,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

export default emailSender;
