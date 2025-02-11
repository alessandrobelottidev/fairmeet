import secrets from '../../../src/core/secrets';
import UserModel from '../../../src/features/auth/models/user';
import { Role } from '../../../src/features/auth/types/role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('User Model', () => {
  describe('User Creation & Password Hashing', () => {
    it('should hash password before saving', async () => {
      const user = await UserModel.create({
        handle: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: Role.BASIC,
      });

      // Password should be hashed
      expect(user.password).not.toBe('password123');
      // Should be able to compare with bcrypt
      const isMatch = await bcrypt.compare('password123', user.password);
      expect(isMatch).toBe(true);
    });

    it('should not rehash password if not modified', async () => {
      const user = await UserModel.create({
        handle: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: Role.BASIC,
      });

      const firstHash = user.password;
      user.handle = 'newhandle';
      await user.save();

      expect(user.password).toBe(firstHash);
    });
  });

  describe('Authentication Methods', () => {
    let user: any;

    beforeEach(async () => {
      user = await UserModel.create({
        handle: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: Role.BASIC,
      });
    });

    it('should generate valid access token', () => {
      const token = user.generateAccessToken();
      const decoded = jwt.verify(token, secrets.ACCESS_TOKEN.secret) as jwt.JwtPayload;

      expect(decoded._id).toBe(user._id.toString());
      expect(decoded.handle).toBe(user.handle);
      expect(decoded.role).toBe(user.role);
      expect(decoded.email).toBe(user.email);
    });

    it('should generate and store refresh token', async () => {
      const refreshToken = await user.generateRefreshToken();
      const decoded = jwt.verify(refreshToken, secrets.REFRESH_TOKEN.secret) as jwt.JwtPayload;

      expect(decoded._id).toBe(user._id.toString());
      expect(user.tokens.length).toBe(1);
    });

    it('should generate reset password token', async () => {
      const resetToken = await user.generateResetToken();

      expect(resetToken).toBeDefined();
      expect(user.resetPasswordToken).toBeDefined();
      expect(user.resetPasswordTokenExpiry).toBeDefined();
      expect(user.resetPasswordTokenExpiry).toBeInstanceOf(Date);
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      await UserModel.create({
        handle: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: Role.BASIC,
      });
    });

    it('should find user by correct credentials', async () => {
      const user = await UserModel.findByCredentials('test@example.com', 'password123');
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      await expect(UserModel.findByCredentials('wrong@example.com', 'password123')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should reject invalid password', async () => {
      await expect(
        UserModel.findByCredentials('test@example.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('JSON Transformation', () => {
    it('should only return safe fields when converted to JSON', async () => {
      const user = await UserModel.create({
        handle: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: Role.BASIC,
      });

      const userJSON = user.toJSON();

      // Should include these fields
      expect(userJSON.handle).toBe('testuser');
      expect(userJSON.email).toBe('test@example.com');
      expect(userJSON.role).toBe(Role.BASIC);

      // Should not include these fields
      expect(userJSON.password).toBeUndefined();
      expect(userJSON.tokens).toBeUndefined();
      expect(userJSON.resetPasswordToken).toBeUndefined();
      expect(userJSON.resetPasswordTokenExpiry).toBeUndefined();
    });
  });
});
