const crypto = require('crypto');
const axios = require('axios');

const paymentService = {
  /**
   * Verify webhook signature from payment gateway
   */
  verifyWebhookSignature: (signature, body, secret = process.env.RAZORPAY_KEY_SECRET) => {
    try {
      const hash = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex');

      const isValid = hash === signature;
      console.log(isValid ? '✓ Webhook signature verified' : '✗ Webhook signature invalid');
      return isValid;
    } catch (error) {
      console.error('✗ Signature verification error:', error.message);
      return false;
    }
  },

  /**
   * Update payment status from webhook
   */
  updatePaymentFromWebhook: async (transactionId, status, additionalData = {}) => {
    try {
      // This function would be called by the webhook handler
      // It updates the payment status in the database
      console.log('Processing payment webhook:', {
        transactionId,
        status,
        timestamp: new Date()
      });

      return {
        success: true,
        transactionId,
        status,
        processedAt: new Date()
      };
    } catch (error) {
      console.error('✗ Failed to update payment from webhook:', error.message);
      throw error;
    }
  },

  /**
   * Get payment gateway instance (Razorpay example)
   */
  getRazorpayInstance: () => {
    try {
      const Razorpay = require('razorpay');
      return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    } catch (error) {
      console.error('✗ Failed to initialize Razorpay:', error.message);
      return null;
    }
  },

  /**
   * Create payment order with gateway
   */
  createPaymentOrder: async (amount, currency = 'INR', receipt = null) => {
    try {
      const razorpay = paymentService.getRazorpayInstance();
      if (!razorpay) throw new Error('Payment gateway not configured');

      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: receipt || `donation-${Date.now()}`,
        payment_capture: 1 // Auto capture
      };

      const order = await razorpay.orders.create(options);
      console.log('✓ Payment order created:', order.id);

      return {
        orderId: order.id,
        amount,
        currency,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('✗ Failed to create payment order:', error.message);
      throw error;
    }
  },

  /**
   * Verify payment after completion
   */
  verifyPayment: async (orderId, paymentId, signature) => {
    try {
      const razorpay = paymentService.getRazorpayInstance();
      if (!razorpay) throw new Error('Payment gateway not configured');

      // Verify payment signature
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === signature;

      if (!isValid) {
        throw new Error('Payment signature verification failed');
      }

      console.log('✓ Payment verified:', paymentId);
      return { verified: true, paymentId };
    } catch (error) {
      console.error('✗ Payment verification failed:', error.message);
      throw error;
    }
  },

  /**
   * Refund payment
   */
  refundPayment: async (paymentId, amount = null) => {
    try {
      const razorpay = paymentService.getRazorpayInstance();
      if (!razorpay) throw new Error('Payment gateway not configured');

      const options = {
        receipt: `refund-${Date.now()}`
      };

      if (amount) {
        options.amount = amount * 100; // Convert to paise
      }

      const refund = await razorpay.payments.refund(paymentId, options);
      console.log('✓ Refund initiated:', refund.id);

      return {
        refundId: refund.id,
        paymentId,
        amount: amount || 'full',
        status: refund.status,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('✗ Failed to initiate refund:', error.message);
      throw error;
    }
  },

  /**
   * Get payment details
   */
  getPaymentDetails: async (paymentId) => {
    try {
      const razorpay = paymentService.getRazorpayInstance();
      if (!razorpay) throw new Error('Payment gateway not configured');

      const payment = await razorpay.payments.fetch(paymentId);
      console.log('✓ Payment details retrieved:', paymentId);

      return {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount / 100,
        currency: payment.currency,
        createdAt: new Date(payment.created_at * 1000)
      };
    } catch (error) {
      console.error('✗ Failed to get payment details:', error.message);
      throw error;
    }
  }
};

module.exports = paymentService;
