import { Role } from '../user.interface';
import { AuthError } from '@core/errors/auth.error';
import { CustomError } from '@core/errors/custom.error';
import secrets from '@core/secrets';
import { sendEmail } from '@core/services/email/sendEmail';
import UserModel from '@features/auth/models/user';
import crypto from 'crypto';
import { RequestHandler } from 'express';
import jsonWebToken from 'jsonwebtoken';

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    /* Custom methods on user are defined in User model */
    const user = await UserModel.findByCredentials(email, password); // Identify and retrieve user by credentials
    const accessToken = user.generateAccessToken(); // Create Access Token
    const refreshToken = await user.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      secrets.REFRESH_TOKEN.cookie.name,
      refreshToken,
      secrets.REFRESH_TOKEN.cookie.options,
    );

    // Send Response on successful Login
    res.json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { handle, email, password } = req.body;

    /* Custom methods on newUser are defined in User model */
    const newUser = await UserModel.create({ handle, email, password, role: Role.BASIC });
    await newUser.save(); // Save new User to DB
    const accessToken = newUser.generateAccessToken(); // Create Access Token
    const refreshToken = await newUser.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      secrets.REFRESH_TOKEN.cookie.name,
      refreshToken,
      secrets.REFRESH_TOKEN.cookie.options,
    );

    // Send Response on successful Sign Up
    res.status(201).json({
      success: true,
      user: newUser,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body;

    // Authenticated user ID attached on `req` by authentication middleware
    const dbUser = await UserModel.findById(user.id);
    const cookies = req.cookies;
    const refreshToken = cookies[secrets.REFRESH_TOKEN.cookie.name];

    // Create a refresh token hash
    const rTknHash = crypto
      .createHmac('sha256', secrets.REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest('hex');
    dbUser!.tokens = dbUser!.tokens.filter((tokenObj) => tokenObj.token !== rTknHash);
    await dbUser!.save();

    // Set cookie expiry option to a past date so it is destroyed
    const expireCookieOptions = Object.assign({}, secrets.REFRESH_TOKEN.cookie.options, {
      expires: new Date(1),
    });

    // Destroy refresh token cookie with `expireCookieOptions` containing a past date
    res.cookie(secrets.REFRESH_TOKEN.cookie.name, '', expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logoutAllDevices: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body;

    // Authenticated user ID attached on `req` by authentication middleware
    const dbUser = await UserModel.findById(user.id);

    dbUser!.tokens = [];
    await dbUser!.save();

    // Set cookie expiry to past date to mark for destruction
    const expireCookieOptions = Object.assign({}, secrets.REFRESH_TOKEN.cookie.options, {
      expires: new Date(1),
    });

    // Destroy refresh token cookie
    res.cookie(secrets.REFRESH_TOKEN.cookie.name, '', expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const refreshAccessToken: RequestHandler = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const refreshTokenCookieName = cookies[secrets.REFRESH_TOKEN.cookie.name];

    if (!refreshTokenCookieName) {
      throw new AuthError('Authentication error!', 401, 'You are unauthenticated', {
        realm: 'Obtain new Access Token',
        error: 'no_rft',
        error_description: 'Refresh Token is missing!',
      });
    }

    const decodedRefreshTkn = jsonWebToken.verify(
      refreshTokenCookieName,
      secrets.REFRESH_TOKEN.secret,
    ) as jsonWebToken.JwtPayload;
    const rTknHash = crypto
      .createHmac('sha256', secrets.REFRESH_TOKEN.secret)
      .update(refreshTokenCookieName)
      .digest('hex');

    const userWithRefreshTkn = await UserModel.findOne({
      _id: decodedRefreshTkn._id,
      'tokens.token': rTknHash,
    });

    if (!userWithRefreshTkn)
      throw new AuthError('Authentication Error', undefined, 'You are not authenticated!', {
        realm: 'Obtain a new Access Token and refresh token',
      });

    // GENERATE NEW ACCESSTOKEN
    const newAtkn = userWithRefreshTkn.generateAccessToken();

    res.status(201);
    res.set({ 'Cache-Control': 'no-store', Pragma: 'no-cache' });

    // Send response with NEW accessToken
    res.json({
      success: true,
      accessToken: newAtkn,
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(
        new AuthError(error, undefined, 'You are unauthenticated', {
          realm: 'Obtain a new Access Token and RefreshToken',
          error_description: 'token error',
        }),
      );
      return;
    }
    next(error);
  }
};

const forgotPassword: RequestHandler = async (req, res, next) => {
  const MSG = `If ${
    req.body?.email || '__'
  } is found with us, we've sent an email to it with instructions to reset your password.`;

  try {
    const email = req.body.email;

    const user = await UserModel.findOne({ email });

    // If email is not found, we throw an exception BUT with 200 status code
    // because it is a security vulnerability to inform users
    // that the Email is not found.
    // To avoid handle enumeration attacks, no extra response data is provided when an email is successfully sent. (The same response is provided when the handle is invalid.)
    if (!user) throw new CustomError('Reset link sent', 200, MSG);

    let resetToken = await user.generateResetToken();
    resetToken = encodeURIComponent(resetToken);

    const resetPath = req.header('X-reset-base');
    const origin = req.header('Origin');

    const resetUrl = resetPath ? `${resetPath}/${resetToken}` : `${origin}/resetpass/${resetToken}`;
    console.log('Password reset URL: %s', resetUrl);

    const emailMessage = `
      <h1>You have requested to change your password</h1>
      <p>You are receiving this because someone(hopefully you) has requested to reset password for your account.<br/>
      Please click on the following link, or paste in your browser to complete the password reset.
      </p>
      <p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      </p>
      <p>
      <em>
          If you did not request this, you can safely ignore this email and your password will remain unchanged.
      </em>
      </p>
      <p>
      <strong>DO NOT share this link with anyone else!</strong><br />
      <small>
          <em>
          This password reset link will <strong>expire after ${
            secrets.RESET_PASSWORD_TOKEN.expiry || 5
          } minutes.</strong>
          </em>
      <small/>
      </p>
    `;

    try {
      await sendEmail({
        to: user.email,
        html: emailMessage,
        subject: 'Reset password',
      });

      res.json({
        message: 'Reset link sent',
        feedback: MSG,
        success: true,
      });
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      await user.save();

      console.log(error.message);
      throw new CustomError('Internal issues standing in the way', 500);
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const resetToken = req.params.resetToken;

    const [tokenValue, tokenSecret] = decodeURIComponent(String(resetToken)).split('+');

    // Recreate the reset Token hash
    const resetTokenHash = crypto
      .createHmac('sha256', tokenSecret)
      .update(tokenValue)
      .digest('hex');

    const user = await UserModel.findOne({
      resetpasswordtoken: resetTokenHash,
      resetpasswordtokenexpiry: { $gt: Date.now() },
    });
    if (!user) throw new CustomError('The reset link is invalid', 400);

    user.password = req.body.password; // Will be hashed by mongoose middleware
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;

    await user.save();

    // Email to notify owner of the account
    const message = `<h3>This is a confirmation that you have changed Password for your account.</h3>`;
    // No need to await
    sendEmail({
      to: user.email,
      html: message,
      subject: 'Password changed',
    });

    res.json({
      message: 'Password reset successful',
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const fetchUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const retrievedUser = await UserModel.findById(userId);

    res.json({
      success: true,
      user: retrievedUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const fetchAuthUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body;
    const dbUser = await UserModel.findById(user.id);

    res.json({
      success: true,
      user: dbUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  login,
  signUp,
  logout,
  logoutAllDevices,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  fetchAuthUserProfile,
};
