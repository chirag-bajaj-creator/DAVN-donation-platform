const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

const emailService = {
  sendPasswordReset: async (email, token, resetUrl) => {
    try {
      const mailOptions = {
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@hravinder.com',
        to: email,
        subject: 'Password Reset Request - Hravinder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password. Click the link below to proceed:</p>
            <p>
              <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                Reset Password
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              This link expires in 24 hours. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email }, 'Password reset email sent');
    } catch (error) {
      logger.error({ err: error, email }, 'Failed to send password reset email');
      throw new Error('Failed to send password reset email');
    }
  },

  sendDonationConfirmation: async (email, donation) => {
    try {
      const mailOptions = {
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@hravinder.com',
        to: email,
        subject: `Donation Confirmation - ${donation.type} Donation`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank You for Your Donation!</h2>
            <p>Your donation has been successfully submitted.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>Donation ID:</strong> ${donation._id}</p>
              <p><strong>Type:</strong> ${donation.type.toUpperCase()}</p>
              <p><strong>Amount:</strong> Rs. ${donation.amount}</p>
              <p><strong>Status:</strong> ${donation.status}</p>
              <p><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
            </div>
            <p>We are grateful for your contribution to help those in need.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, donationId: donation._id }, 'Donation confirmation email sent');
    } catch (error) {
      logger.error({ err: error, email, donationId: donation._id }, 'Failed to send donation confirmation email');
    }
  },

  sendVerificationUpdate: async (email, needy, status, comment = '') => {
    try {
      const statusMessage = status === 'approved'
        ? 'Your registration has been approved!'
        : 'Your registration was not approved at this time.';

      const mailOptions = {
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@hravinder.com',
        to: email,
        subject: 'Verification Update - Hravinder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verification Status Update</h2>
            <p><strong>${statusMessage}</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>Status:</strong> ${status.toUpperCase()}</p>
              ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ''}
            </div>
            ${status === 'approved' ? '<p>You can now receive donations from generous donors.</p>' : ''}
            <p>If you have questions, please contact our support team.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, status, needyId: needy?._id }, 'Verification update email sent');
    } catch (error) {
      logger.error({ err: error, email, status, needyId: needy?._id }, 'Failed to send verification update email');
    }
  },

  sendQRExpiryReminder: async (email, qrId, expiryTime) => {
    try {
      const mailOptions = {
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@hravinder.com',
        to: email,
        subject: 'QR Code Payment Expiry Reminder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Payment Reminder</h2>
            <p>Your QR code payment will expire soon.</p>
            <p><strong>Expiry Time:</strong> ${new Date(expiryTime).toLocaleString()}</p>
            <p>Please complete your payment before expiry. Generate a new QR code if needed.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, qrId }, 'QR expiry reminder email sent');
    } catch (error) {
      logger.error({ err: error, email, qrId }, 'Failed to send QR expiry reminder');
    }
  }
};

module.exports = emailService;
