require('dotenv').config();

const { logger } = require('./logger');

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'SENDGRID_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const validateEnv = () => {
  const missingVars = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    logger.warn({ missingVars }, 'Missing environment variables');
    logger.warn('Please update .env file with all required variables');

    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  logger.info('Environment variables validated');
};

module.exports = {
  validateEnv,
  env: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '1h',
    refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@hravinder.com',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    upiMerchantId: process.env.UPI_MERCHANT_ID,
    emailPassword: process.env.EMAIL_PASSWORD
  }
};
