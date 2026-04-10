const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../schemas/userSchema');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * POST /api/auth/register-admin
 * Register new admin (requires admin secret)
 */
router.post('/register-admin', validate(registerSchema), authController.registerAdmin);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authController.logout);

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * POST /api/auth/reset-password/:token
 * Reset password with token
 */
router.post('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

/**
 * POST /api/auth/refresh-token
 * Refresh access token
 */
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
