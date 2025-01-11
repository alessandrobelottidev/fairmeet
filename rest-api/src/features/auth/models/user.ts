import { CustomError } from '@core/errors/custom.error';
import secrets from '@core/secrets';
import type { IUserDocument, IUserModel } from '@features/auth/user.interface';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import mongoose, { Model, Schema } from 'mongoose';

const UserSchema = new Schema<IUserDocument, IUserModel>({
  handle: { type: String, trim: true, required: [true, 'Username is required'], unique: true },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    required: [true, 'A role is required'],
  },
  // We will be storing the refresh tokens here...
  tokens: [
    {
      token: { required: true, type: String },
    },
  ],
  resetPasswordToken: String,
  resetPasswordTokenExpiry: Date,
});

/* SCHEMA OPTION */
// Defines how the User document should behave when converted to JSON
// virtuals: means that virtual properties (fields that are computed or derived, not stored in the database) will be included in the JSON output
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    const { handle, email } = ret;

    return { handle, email }; // return fields we need
  },
});

/* MONGOOSE MIDDLEWARE */
// Runs before saving the new user data, if password was changed from previous state,
// it will get encrypted using bcrypt
UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

/* STATIC METHODS */

// Helper function to get a user given email and password (the plain password is compared with )
UserSchema.statics.findByCredentials = async function (email: string, password: string) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new CustomError('Invalid credentials', 400, 'Email or password is incorrect');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new CustomError('Invalid credentials', 400, 'Email or password is incorrect');
  }

  return user;
};

/* INSTANCE METHODS */
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
UserSchema.methods.generateAccessToken = function () {
  const accessToken = jsonwebtoken.sign(
    {
      _id: this._id.toString(),
      handle: this.handle,
      role: this.role,
      email: this.email,
    },
    secrets.ACCESS_TOKEN.secret,
    {
      expiresIn: secrets.ACCESS_TOKEN.expiry,
    },
  );

  return accessToken;
};

UserSchema.methods.generateRefreshToken = async function () {
  // Create signed refresh token
  const refreshToken = jsonwebtoken.sign(
    { _id: this._id.toString() },
    secrets.REFRESH_TOKEN.secret,
    { expiresIn: secrets.REFRESH_TOKEN.expiry },
  );

  // Create a 'refresh token hash' from 'refresh token'

  const refreshTokenHash = crypto
    .createHmac('sha256', secrets.REFRESH_TOKEN.secret)
    .update(refreshToken)
    .digest('hex');

  // Save 'refresh token hash' to database

  this.tokens.push({ token: refreshTokenHash });
  await this.save();

  return refreshToken;
};

UserSchema.methods.generateResetToken = async function () {
  // Using native nodejs crypto module to create resetTokenValue and resetTokenSecret

  const resetTokenValue = crypto.randomBytes(20).toString('base64url');
  const resetTokenSecret = crypto.randomBytes(10).toString('hex');

  // Separator of `+` because generated base64url characters doesn't include this character

  const resetToken = `${resetTokenValue}+${resetTokenSecret}`;

  // Create a hash

  const resetTokenHash = crypto
    .createHmac('sha256', resetTokenSecret)
    .update(resetTokenValue)
    .digest('hex');

  this.resetPasswordToken = resetTokenHash;
  this.resetPasswordTokenExpiry = new Date(
    Date.now() + (Number(secrets.RESET_PASSWORD_TOKEN.expiry) || 5) * 60 * 1000,
  );

  await this.save();
  return resetToken;
};

const UserModel = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default UserModel;
