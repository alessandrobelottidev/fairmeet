import { Document, Model } from 'mongoose';

enum Role {
  ADMIN = 'admin',
  BUSINESS_OWNER = 'business_owner',
  GOV_ENTITY = 'gov_entity',
  BASIC = 'basic',
}

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

export { Role };
export type { IUser, IUserDocument, IUserModel };
