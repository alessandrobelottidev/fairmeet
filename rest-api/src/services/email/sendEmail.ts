import mailService from './service';
import secrets from '@src/secrets';

const fixedMailOptions = {
  from: secrets.EMAIL.from,
};

export const sendEmail = (options = {}) => {
  const mailOptions = Object.assign({}, options, fixedMailOptions);
  return mailService(mailOptions);
};
