const express = require('express');
const paymentController = require('../controllers/paymentController');
const validate = require('../middleware/validate');
const {
  generateQRSchema,
  updatePaymentStatusSchema
} = require('../schemas/paymentSchema');

const router = express.Router();

/**
 * POST /api/qr-payments
 * Generate QR code for cash donation
 */
router.post(
  '/',
  validate(generateQRSchema),
  paymentController.generateQR
);

/**
 * GET /api/qr-payments/:id
 * Get QR payment status
 */
router.get('/:id', paymentController.getQRStatus);

/**
 * PATCH /api/qr-payments/:id
 * Update payment status
 */
router.patch(
  '/:id',
  validate(updatePaymentStatusSchema),
  paymentController.updatePaymentStatus
);

/**
 * POST /api/qr-payments/webhook
 * Webhook handler for payment gateway
 */
router.post('/webhook', paymentController.handlePaymentWebhook);

module.exports = router;
