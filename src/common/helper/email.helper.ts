import { statusCode } from "@messages";
import { ApiError } from "./api-error.helper";
import * as nodemailer from "nodemailer";


 export async function sendEmail(to: string, phone: string, password: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Registration Service" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Your Registration Details',
      html: `
        <h2>Welcome to the Registration System</h2>
        <p>Your account has been successfully created. Below are your login details:</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please keep this information secure and do not share it with others.</p>
        <p>Thank you!</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new ApiError(
        statusCode.InternalServerError,
        `Failed to send email: ${error.message}`
      );
    }
  }