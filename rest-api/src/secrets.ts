import dotenv from 'dotenv';
import { CookieOptions } from 'express';

dotenv.config();

const REST_API_PORT = process.env.REST_API_PORT;

const MONGODB_CONNECTION_URI: string = process.env.MONGODB_CONNECTION_URI ?? '';

const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET ?? '',
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY ?? '120s',
};

/**
 * COOKIE OPTION is a configuration setting for the cookies that will be used during auth
 *
 * By default, browsers will not send cookies in cross-origin requests.
 * Since we are building an API that we intend to consume from client-side sitting on a different origin,
 * we have to set some configurations on the cookie to store in a user's browser.
 * These configurations will allow the cookie to be sent back when cross-site request to our server is made.
 *
 * We have set sameSite property to "None" which in a cookie context means that the browser can send the
 * cookie with cross site requests.
 *
 * However, setting a SameSite attribute to None will also require you to set Secure attribute,
 * implying a cookie is only sent in an encrypted request over the HTTPS protocol.
 * Hence in cookie configurations above, we also set secure to true.
 * Localhost is not a https protocol but it is treated special i.e cookie should still be sent
 * even with secure=true. You can learn more about cookie sameSite attribute here.
 *
 * Another property is httpOnly set to true. In cookie context, a cookie with httponly attribute stored
 * in the browser is inaccessible to scripts running on the browser.
 *
 * maxAge property sets the age of the cookie to expire in browser.
 *
 * TODO: Test that this is actually true
 * TODO: Setup services so that they comunicate through https
 */
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET ?? '',
  cookie: {
    name: 'refreshTkn',
    options: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    } as CookieOptions,
  },
  expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY ?? '7d',
};

const RESET_PASSWORD_TOKEN = {
  expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

const EMAIL = {
  authUser: process.env.EMAIL_SERVICE_USERNAME ?? '',
  authPass: process.env.EMAIL_SERVICE_PASSWORD ?? '',
  host: process.env.EMAIL_SERVICE_HOST ?? '',
  port: process.env.EMAIL_SERVICE_PORT ?? 2525,
  from: process.env.EMAIL_SERVICE_FROM ?? '',
};

const secrets = {
  REST_API_PORT,
  MONGODB_CONNECTION_URI,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  RESET_PASSWORD_TOKEN,
  EMAIL,
};

export default secrets;
