const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');
const crypto = require('crypto');
const { logger } = require('../config/logger');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

const authController = {
  /**
   * Register new user
   */
  register: async (req, res, next) => {
    try {
      const { email, password, name, phone, address } = req.validatedData;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { phone }]
      });

      if (existingUser) {
        return res.status(422).json({
          success: false,
          error: existingUser.email === email.toLowerCase()
            ? 'Email already registered'
            : 'Phone number already registered',
          code: 'USER_EXISTS',
          timestamp: new Date()
        });
      }

      // Create new user
      const newUser = new User({
        email: email.toLowerCase(),
        password,
        name,
        phone,
        address,
        role: 'user'
      });

      await newUser.save();

      const { accessToken, refreshToken } = generateTokens(newUser._id, newUser.role);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user_id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          role: newUser.role
        },
        tokens: {
          accessToken,
          refreshToken
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Register new admin
   */
  registerAdmin: async (req, res, next) => {
    try {
      const { email, password, name, phone, address, adminSecret } = req.validatedData;

      // Validate admin secret
      if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
        return res.status(403).json({
          success: false,
          error: 'Invalid admin registration secret',
          code: 'INVALID_SECRET',
          timestamp: new Date()
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { phone }]
      });

      if (existingUser) {
        return res.status(422).json({
          success: false,
          error: existingUser.email === email.toLowerCase()
            ? 'Email already registered'
            : 'Phone number already registered',
          code: 'USER_EXISTS',
          timestamp: new Date()
        });
      }

      // Create new admin user
      const newUser = new User({
        email: email.toLowerCase(),
        password,
        name,
        phone,
        address,
        role: 'admin',
        isActive: true
      });

      await newUser.save();

      const { accessToken, refreshToken } = generateTokens(newUser._id, newUser.role);

      res.status(201).json({
        success: true,
        message: 'Admin registration successful',
        data: {
          user_id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          role: newUser.role
        },
        tokens: {
          accessToken,
          refreshToken
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login user
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.validatedData;

      // Find user and select password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date()
        });
      }

      // Verify password
      const isPasswordValid = await user.matchPassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date()
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'User account is inactive',
          code: 'ACCOUNT_INACTIVE',
          timestamp: new Date()
        });
      }

      const { accessToken, refreshToken } = generateTokens(user._id, user.role);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user_id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (req, res, next) => {
    try {
      // In a real application, you might want to blacklist the token or
      // store logout timestamp in the database
      res.status(200).json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.validatedData;

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Don't reveal if email exists (security best practice)
        return res.status(200).json({
          success: true,
          message: 'If an account exists with this email, you will receive a password reset link',
          timestamp: new Date()
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      user.passwordResetToken = resetTokenHash;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // Send email
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      try {
        await emailService.sendPasswordReset(user.email, resetToken, resetUrl);
      } catch (emailError) {
        logger.error({ err: emailError, email: user.email }, 'Failed to send reset email');
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        throw new Error('Failed to send password reset email');
      }

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to email',
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.validatedData;

      // Hash the reset token to compare with stored hash
      const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        passwordResetToken: resetTokenHash,
        passwordResetExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token',
          code: 'INVALID_RESET_TOKEN',
          timestamp: new Date()
        });
      }

      // Update password
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password reset successful',
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token is required',
          code: 'NO_REFRESH_TOKEN',
          timestamp: new Date()
        });
      }

      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
          return res.status(401).json({
            success: false,
            error: 'Invalid refresh token',
            code: 'INVALID_REFRESH_TOKEN',
            timestamp: new Date()
          });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);

        res.status(200).json({
          success: true,
          message: 'Token refreshed successfully',
          tokens: {
            accessToken,
            refreshToken: newRefreshToken
          },
          timestamp: new Date()
        });
      } catch (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
          timestamp: new Date()
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
