import authValidationSchema from '@validators/auth.validator';
import fetchUserProfileSchema from '@validators/user.validator';
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
      req.body = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateAuthLoginSchema = createValidationHandler(authValidationSchema.loginSchema);
export const validateAuthSignupSchema = createValidationHandler(authValidationSchema.signupSchema);
export const validateAuthForgotPasswordSchema = createValidationHandler(
  authValidationSchema.forgotPasswordSchema,
);
export const validateAuthResetPasswordSchema = createValidationHandler(
  authValidationSchema.resetPasswordSchema,
);

// export const validateAuthProfileSchema = createValidationHandler(fetchUserProfileSchema);
