import { createValidationHandler } from '../../../src/core/middlewares/zodValidation/validation';
import { Request, Response } from 'express';
import { z } from 'zod';

describe('Validation Middleware', () => {
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

  it('should pass valid data', async () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    mockReq = {
      body: {
        name: 'Test User',
        age: 25,
      },
    };

    const validationMiddleware = createValidationHandler(schema);
    await validationMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('should reject invalid data', async () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    mockReq = {
      body: {
        name: 'Test User',
        age: 'invalid', // Should be a number
      },
    };

    const validationMiddleware = createValidationHandler(schema);
    await validationMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(z.ZodError));
  });

  it('should preserve user and auth data', async () => {
    const schema = z.object({
      name: z.string(),
    });

    mockReq = {
      body: {
        name: 'Test User',
        user: { id: '123' },
        accessToken: 'token123',
      },
    };

    const validationMiddleware = createValidationHandler(schema);
    await validationMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(mockReq.body.user).toBeDefined();
    expect(mockReq.body.accessToken).toBeDefined();
  });
});
