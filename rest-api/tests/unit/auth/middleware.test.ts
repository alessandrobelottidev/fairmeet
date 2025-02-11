import { createTestUser } from '../../helpers/testUtils';
import secrets from '@core/secrets';
import {
  requireAuthAndRoles,
  requireAuthentication,
} from '@features/auth/middlewares/authGuard.middleware';
import { Role } from '@features/auth/types/role';
import { IUserDocument } from '@features/auth/types/user';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('requireAuthentication', () => {
    it('should pass valid token', async () => {
      const user = await createTestUser();
      const token = jwt.sign({ _id: user._id, role: Role.BASIC }, secrets.ACCESS_TOKEN.secret);

      mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: {},
      };

      await requireAuthentication(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.body.user).toBeDefined();
      expect(mockReq.body.user.id).toBe((user._id as IUserDocument).toString());
    });

    it('should reject missing authorization header', async () => {
      mockReq = {
        headers: {},
        body: {},
      };

      await requireAuthentication(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication Error',
        }),
      );
    });

    it('should reject invalid token format', async () => {
      mockReq = {
        headers: {
          authorization: 'InvalidToken',
        },
        body: {},
      };

      await requireAuthentication(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication Error',
        }),
      );
    });

    it('should reject expired token', async () => {
      const user = await createTestUser();
      const token = jwt.sign({ _id: user._id, role: Role.BASIC }, secrets.ACCESS_TOKEN.secret, {
        expiresIn: '0s',
      });

      mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: {},
      };

      // Wait for token to expire
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await requireAuthentication(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication Error',
          feedback: 'Token lifetime exceeded!',
        }),
      );
    });
  });

  describe('requireAuthAndRoles', () => {
    it('should pass user with correct role', async () => {
      const user = await createTestUser({ role: Role.ADMIN });
      const token = jwt.sign({ _id: user._id, role: Role.ADMIN }, secrets.ACCESS_TOKEN.secret);

      mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: {},
      };

      const middleware = requireAuthAndRoles([Role.ADMIN]);
      await middleware[1](mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('should reject user with incorrect role', async () => {
      const user = await createTestUser({ role: Role.BASIC });
      const token = jwt.sign({ _id: user._id, role: Role.BASIC }, secrets.ACCESS_TOKEN.secret);

      mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: {},
      };

      const middleware = requireAuthAndRoles([Role.ADMIN]);
      await middleware[1](mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authorization Error',
          feedback: 'Non hai il ruolo richiesto',
        }),
      );
    });
  });
});
