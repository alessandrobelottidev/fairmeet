import { Document, Model } from 'mongoose';

interface IUser {
  handle: string;
  email: string;
  password: string;
  role: string;
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
