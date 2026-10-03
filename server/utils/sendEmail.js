const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendVerificationEmail(email, otp) {
  await transporter.sendMail({
    from: `"DirectMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'DirectMart Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to DirectMart</h2>

        <p>Your email verification code is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 25px 0;
        ">
          ${otp}
        </div>

        <p>This OTP will expire in <strong>10 minutes</strong>.</p>

        <p>
          If you did not create a DirectMart account,
          you can ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };