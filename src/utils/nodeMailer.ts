import nodemailer from "nodemailer";
import path from "path";

export const sendOtpEmail = async (
  email: string,
  otp: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSCODE,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "One-Time Password (OTP) for Authentication",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p>Dear User,</p>
          <p>Your One-Time Password (OTP) for authentication is:<h1> ${otp} </h1> </p>
          <div style="margin-top: 20px;">
            <img src="cid:mail_img" alt="Your Project Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "mail_img.jpg",
          path: path.join(__dirname, "../public/images/mail_img.jpg"),
          cid: "mail_img", 
        },
      ],
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};
