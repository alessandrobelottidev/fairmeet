import authController from '@controllers/auth.controller';
import {
  validateAuthForgotPasswordSchema,
  validateAuthLoginSchema,
  validateAuthResetPasswordSchema,
  validateAuthSignupSchema,
} from '@middlewares/auth.middleware';
import requireAuthentication from '@src/middlewares/core/authCheck';
import e from 'express';

const router = e.Router();

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticate user and receive access token
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
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateAuthLoginSchema, authController.login);

/**
 * @swagger
 * /v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Create a new user account with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
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
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       409:
 *         description: Email already exists
 */
router.post('/signup', validateAuthSignupSchema, authController.signup);

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     security:
 *       - bearerAuth: []     # [] is required for valid swagger
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Logout user from current device
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
 *       - bearerAuth: []     # [] is required for valid swagger
 *     tags:
 *       - Auth
 *     summary: Logout from all devices
 *     description: Logout user from all devices and invalidate all refresh tokens
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
 *       - Auth
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token cookie
 *     responses:
 *       201:
 *         description: New access token generated
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
 *       - Auth
 *     summary: Request password reset
 *     description: Send password reset link to user's email
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
 *                 feedback:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.post('/forgotpass', validateAuthForgotPasswordSchema, authController.forgotPassword);

/**
 * @swagger
 * /v1/auth/resetpass/{resetToken}:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     description: Reset user password using reset token
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token received via email
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
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []     # [] is required for valid swagger
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
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requireAuthentication, authController.fetchAuthUserProfile);

export default router;
