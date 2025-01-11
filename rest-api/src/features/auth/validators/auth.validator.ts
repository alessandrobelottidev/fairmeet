import { CustomError } from '@core/middlewares/errors/custom.error';
import UserModel from '@features/auth/models/user';
import z from 'zod';

// Base email schema that's reused across different validations
const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Email CANNOT be empty' })
  .email({ message: 'Email is invalid' });

// Base password schema that's reused across different validations
const passwordSchema = z
  .string()
  .min(1, { message: 'Password CANNOT be empty' })
  .min(4, { message: 'Password MUST be at least 4 characters long' });

// Login schema
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password CANNOT be empty' }),
});

// Signup schema
const signupSchema = z
  .object({
    handle: z.string().toLowerCase().trim().min(1, { message: 'Username CANNOT be empty' }),
    email: emailSchema,
    password: passwordSchema,
  })
  .refine(
    async (data) => {
      const emailExists = await UserModel.findOne({ email: data.email });
      if (emailExists) {
        throw new CustomError('E-mail gia in uso...', 409);
      }

      const handleExists = await UserModel.findOne({ handle: data.handle });
      if (handleExists) {
        throw new CustomError('Username handle gia in uso...', 409);
      }

      return true;
    },
    {
      message: 'E-mail already in use',
      path: ['email'], // This will make the error appear on the email field
    },
  );

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
const resetPasswordSchema = z
  .object({
    resetToken: z.string().min(1, { message: 'Reset token missing' }),
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords DO NOT match',
    path: ['passwordConfirm'], // This will make the error appear on the passwordConfirm field
  });

const authValidationSchema = {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

export default authValidationSchema;
