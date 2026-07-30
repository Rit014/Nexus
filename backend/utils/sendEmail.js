const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

const sendEmail = async (options) => {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: 'Nexus Dashboard', email: 'ritu72052@gmail.com' },
    to: [{ email: options.to }],
    subject: options.subject,
    textContent: options.text,
  });
};

module.exports = sendEmail;