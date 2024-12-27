import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";

// Importing the asyncHandler to handle asynchronous errors cleanly
const sendEmail = asyncHandler(async (data, req, res) => {
    // Create a transport object using nodemailer to send emails
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Email service provider host for Gmail
        port: 587, // Port used for the email service (587 is for TLS/STARTTLS)
        secure: false, // Set to false because port 587 does not require SSL (use true for port 465)
        auth: { // Authentication credentials
          user: process.env.MAIL_ID, // Email address (stored in environment variables for security)
          pass: process.env.MP, // Email password or app-specific password (stored securely)
        },
    });

    // Sending the email using the transport object
    const info = await transporter.sendMail({
        from: '"Hey dude 👻" <eyob@gmail.com>', // Sender's email address and name
        to: data.to, // Recipient's email address (provided dynamically via the `data` object)
        subject: data.subject, // Subject of the email
        text: data.text, // Plain text body of the email
        html: data.html, // HTML content of the email (for better presentation)
    });

    // Log the message ID of the sent email to the console for debugging or tracking
    console.log("Message sent: %s", info.messageId); 
    // Example output: Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
});

// Exporting the sendEmail function for use in other parts of the application
export default sendEmail;
