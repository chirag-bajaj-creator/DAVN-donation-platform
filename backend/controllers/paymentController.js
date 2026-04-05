const QRPayment = require('../models/QRPayment');
const Donation = require('../models/Donation');
const qrService = require('../services/qrService');
const paymentService = require('../services/paymentService');

const paymentController = {
  /**
   * Generate QR code for cash donation
   */
  generateQR: async (req, res, next) => {
    try {
      const { donation_id } = req.validatedData;
      const userId = req.user.userId;

      // Find donation
      const donation = await Donation.findById(donation_id);

      if (!donation) {
        return res.status(404).json({
          success: false,
          error: 'Donation not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Verify donation belongs to user (unless admin)
      if (donation.donor_id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to generate QR for this donation',
          code: 'FORBIDDEN',
          timestamp: new Date()
        });
      }

      // Check if donation is cash type
      if (donation.type !== 'cash') {
        return res.status(400).json({
          success: false,
          error: 'QR code can only be generated for cash donations',
          code: 'INVALID_DONATION_TYPE',
          timestamp: new Date()
        });
      }

      // Generate unique transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Generate UPI QR code
      const qrData = await qrService.generateUPIQR(
        donation.amount,
        process.env.UPI_MERCHANT_ID || 'hravinder@upi',
        transactionId
      );

      // Set expiry to 24 hours from now
      const expiryAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Save QR payment record
      const qrPayment = new QRPayment({
        donation_id,
        qr_code: qrData.qrCode,
        amount: donation.amount,
        currency: 'INR',
        transactionId,
        status: 'pending',
        expiryAt,
        paymentGateway: 'razorpay'
      });

      await qrPayment.save();

      // Link QR to donation
      donation.qr_payment_id = qrPayment._id;
      await donation.save();

      res.status(201).json({
        success: true,
        message: 'QR code generated successfully',
        data: {
          qr_id: qrPayment._id,
          qr_code: qrPayment.qr_code,
          amount: qrPayment.amount,
          currency: qrPayment.currency,
          transactionId: qrPayment.transactionId,
          status: qrPayment.status,
          expiresAt: qrPayment.expiryAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get QR payment status
   */
  getQRStatus: async (req, res, next) => {
    try {
      const { id } = req.params;

      const qrPayment = await QRPayment.findById(id)
        .populate('donation_id');

      if (!qrPayment) {
        return res.status(404).json({
          success: false,
          error: 'QR payment not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Check if QR has expired
      if (qrPayment.status === 'pending' && new Date() > qrPayment.expiryAt) {
        qrPayment.status = 'expired';
        await qrPayment.save();
      }

      res.status(200).json({
        success: true,
        data: {
          qr_id: qrPayment._id,
          status: qrPayment.status,
          amount: qrPayment.amount,
          currency: qrPayment.currency,
          transactionId: qrPayment.transactionId,
          expiresAt: qrPayment.expiryAt,
          completedAt: qrPayment.completedAt,
          createdAt: qrPayment.createdAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update payment status (from webhook)
   */
  updatePaymentStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.validatedData;

      const qrPayment = await QRPayment.findByIdAndUpdate(
        id,
        {
          status,
          transactionId: transactionId || qrPayment.transactionId,
          completedAt: status === 'completed' ? new Date() : null,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!qrPayment) {
        return res.status(404).json({
          success: false,
          error: 'QR payment not found',
          code: 'NOT_FOUND',
          timestamp: new Date()
        });
      }

      // Update donation status if payment completed
      if (status === 'completed') {
        await Donation.findByIdAndUpdate(
          qrPayment.donation_id,
          { status: 'verified' }
        );
      }

      res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        data: {
          qr_id: qrPayment._id,
          status: qrPayment.status,
          amount: qrPayment.amount,
          transactionId: qrPayment.transactionId,
          completedAt: qrPayment.completedAt
        },
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Webhook handler for payment gateway
   */
  handlePaymentWebhook: async (req, res, next) => {
    try {
      const { event, data } = req.body;

      console.log('Processing webhook:', event);

      switch (event) {
        case 'payment.authorized':
        case 'payment.captured':
          // Update payment status
          await QRPayment.findOneAndUpdate(
            { transactionId: data.transactionId },
            { status: 'completed', completedAt: new Date() }
          );
          break;

        case 'payment.failed':
          await QRPayment.findOneAndUpdate(
            { transactionId: data.transactionId },
            { status: 'expired' }
          );
          break;

        default:
          console.log('Unknown webhook event:', event);
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processed',
        timestamp: new Date()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;
