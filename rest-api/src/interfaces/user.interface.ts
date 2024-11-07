import { Document, Model } from 'mongoose';

// TODO: Add username, remove first name and last name, we dont care about it
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tokens: Array<{ token: string }>;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
}

interface IUserDocument extends IUser, Document {
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
  generateResetToken(): Promise<string>;
}

interface IUserModel extends Model<IUserDocument> {
  findByCredentials(email: string, password: string): Promise<IUserDocument>;
}

export type { IUser, IUserDocument, IUserModel };
