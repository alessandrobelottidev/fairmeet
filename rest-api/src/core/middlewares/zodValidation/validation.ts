import { RequestHandler } from 'express';
import { z } from 'zod';

/**
 * Creates a validation middleware that validates request body against a given schema
 * @param schema The zod schema to validate against
 * @returns Express middleware that validates the request body
 */
export const createValidationHandler = (schema: z.ZodSchema): RequestHandler => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req.body);

      // Preserve user and other auth data
      const { user, accessToken, ...rest } = req.body;
      req.body = {
        ...validatedData,
        user,
        accessToken,
      };
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
};
