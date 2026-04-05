const mongoose = require('mongoose');

const qrPaymentSchema = new mongoose.Schema({
  donation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: [true, 'Donation ID is required']
  },
  qr_code: {
    type: String,
    required: [true, 'QR code is required'],
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'paytm', 'phonepe'],
    default: 'razorpay'
  },
  expiryAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index - auto-delete after expiry time
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
qrPaymentSchema.index({ donation_id: 1 });
qrPaymentSchema.index({ qr_code: 1 });
qrPaymentSchema.index({ transactionId: 1 });
qrPaymentSchema.index({ status: 1 });

module.exports = mongoose.model('QRPayment', qrPaymentSchema);
