import authController from '@features/auth/controllers/auth.controller';
import { requireAuthentication } from '@features/auth/middlewares/authGuard.middleware';
import {
  validateAuthForgotPasswordSchema,
  validateAuthLoginSchema,
  validateAuthResetPasswordSchema,
  validateAuthSignupSchema,
} from '@features/auth/middlewares/validation.middleware';
import e from 'express';

const router = e.Router();

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - Auth | FEATURE
 *     summary: Login user
 *     description: Authenticate user and receive access token plus refresh token cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Pass1234
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     handle:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, business_owner, gov_entity, basic]
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Authentication failed
 */
router.post('/login', validateAuthLoginSchema, authController.login);

/**
 * @swagger
 * /v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth | FEATURE
 *     summary: Register a new user
 *     description: Create a new user account and receive access token plus refresh token cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - handle
 *               - email
 *               - password
 *             properties:
 *               handle:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Pass1234
 *     responses:
 *       201:
 *         description: User successfully created
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     handle:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [basic]
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       409:
 *         description: Email or handle already exists
 */
router.post('/signup', validateAuthSignupSchema, authController.signUp);

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth | FEATURE
 *     summary: Logout user
 *     description: Logout user from current device by invalidating refresh token
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       205:
 *         description: Successfully logged out
 *         headers:
 *           Set-Cookie:
 *             description: Clears refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', requireAuthentication, authController.logout);

/**
 * @swagger
 * /v1/auth/master-logout:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth | FEATURE
 *     summary: Logout from all devices
 *     description: Logout user from all devices by invalidating all refresh tokens
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       205:
 *         description: Successfully logged out from all devices
 *         headers:
 *           Set-Cookie:
 *             description: Clears refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 */
router.post('/master-logout', requireAuthentication, authController.logoutAllDevices);

/**
 * @swagger
 * /v1/auth/reauth:
 *   post:
 *     tags:
 *       - Auth | FEATURE
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token cookie
 *     responses:
 *       201:
 *         description: New access token generated
 *         headers:
 *           Cache-Control:
 *             description: no-store
 *           Pragma:
 *             description: no-cache
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/reauth', authController.refreshAccessToken);

/**
 * @swagger
 * /v1/auth/forgotpass:
 *   post:
 *     tags:
 *       - Auth | FEATURE
 *     summary: Request password reset
 *     description: Send password reset link to user's email with time-limited token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Reset link sent (returns success even if email not found for security)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset link sent
 *                 feedback:
 *                   type: string
 *                   example: If john.doe@example.com is found with us, we've sent an email with instructions to reset your password.
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Error sending email
 */
router.post('/forgotpass', validateAuthForgotPasswordSchema, authController.forgotPassword);

/**
 * @swagger
 * /v1/auth/resetpass/{resetToken}:
 *   patch:
 *     tags:
 *       - Auth | FEATURE
 *     summary: Reset password
 *     description: Reset user password using time-limited reset token
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token received via email (URL encoded)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - passwordConfirm
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPass1234
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: NewPass1234
 *     responses:
 *       200:
 *         description: Password successfully reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid or expired reset token
 */
router.patch(
  '/resetpass/:resetToken',
  validateAuthResetPasswordSchema,
  authController.resetPassword,
);

/**
 * @swagger
 * /v1/auth/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth | FEATURE
 *     summary: Get authenticated user profile
 *     description: Retrieve the profile of the currently authenticated user
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     handle:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, business_owner, gov_entity, basic]
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requireAuthentication, authController.fetchAuthUserProfile);

router.get('/users/:handle', authController.fetchUserId);

export default router;
