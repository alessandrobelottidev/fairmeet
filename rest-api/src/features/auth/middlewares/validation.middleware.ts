import { createValidationHandler } from '@core/middlewares/zodValidation/validation';
import authValidationSchema from '@features/auth/validators/auth.validator';

export const validateAuthLoginSchema = createValidationHandler(authValidationSchema.loginSchema);
export const validateAuthSignupSchema = createValidationHandler(authValidationSchema.signupSchema);
export const validateAuthForgotPasswordSchema = createValidationHandler(
  authValidationSchema.forgotPasswordSchema,
);
export const validateAuthResetPasswordSchema = createValidationHandler(
  authValidationSchema.resetPasswordSchema,
);
