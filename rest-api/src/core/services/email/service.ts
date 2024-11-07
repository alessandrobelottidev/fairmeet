import secrets from '@core/secrets';
import nodemailer from 'nodemailer';

type mailOptions = {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
};

async function main(mailOptions: mailOptions) {
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: secrets.EMAIL.host,
    port: Number(secrets.EMAIL.port),
    auth: {
      user: secrets.EMAIL.authUser,
      pass: secrets.EMAIL.authPass,
    },
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: mailOptions?.from,
    to: mailOptions?.to,
    subject: mailOptions?.subject,
    text: mailOptions?.text,
    html: mailOptions?.html,
  });

  return info;
}

export default main;
