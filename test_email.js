require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

const testEmail = async () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Missing SMTP_USER or SMTP_PASS in .env file!');
    console.error('Make sure you saved the file and they are spelled exactly like that.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log(`⏳ Attempting to send test email to ${process.env.SMTP_USER}...`);
    const info = await transporter.sendMail({
      from: `"KindleWorks System" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: '✅ Test Notification - KindleWorks',
      text: 'If you are reading this, your email notifications are working perfectly!',
    });
    console.log('🎉 Email sent successfully! Check your inbox.');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to send email.');
    console.error('Error Details:', err.message);
    if (err.message.includes('Username and Password not accepted') || err.message.includes('Invalid login')) {
      console.log('\n💡 Tip: Since you are using Gmail, you MUST use an "App Password" (16 characters) instead of your regular password. Make sure 2-Step Verification is enabled on your Google account first!');
    }
    process.exit(1);
  }
};

testEmail();
