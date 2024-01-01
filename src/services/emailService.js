// emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'que.pasa.travelapp@gmail.com',
    pass: process.env.EMAIL_TEST_APP_PSWD,
    type: 'login',
  },
});

const sendResetPasswordOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: 'que.pasa.travelapp@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    });

    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

// Export the function directly
export { sendResetPasswordOTP };
