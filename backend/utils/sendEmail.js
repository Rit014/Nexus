const { Resend } = require('resend');

const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'Nexus <onboarding@resend.dev>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
};

module.exports = sendEmail;