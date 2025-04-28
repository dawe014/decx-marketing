import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Function to send a test email
const sendTestEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "dawittamiru072@gmail.com",  // Change to your test email
      subject: "Test Email - Verification",
      text: "This is a test email from your Node.js app.",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

// Call the function to send a test email
sendTestEmail();
