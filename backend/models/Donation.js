const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor ID is required']
  },
  type: {
    type: String,
    enum: ['cash', 'food', 'shelter', 'medical', 'basic_needs'],
    required: [true, 'Donation type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  status: {
    type: String,
    enum: ['submitted', 'verified', 'in_delivery', 'completed'],
    default: 'submitted'
  },
  details: {
    // For cash donations
    currency: { type: String, default: 'INR' },
    description: String,

    // For food donations
    foodType: String,
    quantity: Number,

    // For shelter donations
    shelterType: String,
    duration: String,

    // For medical donations
    medicineType: String,
    doctorPermission: { type: Boolean, default: false },

    // For basic needs
    items: [String],

    // General
    notes: String
  },
  qr_payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRPayment',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
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

// Indexes for performance
donationSchema.index({ donor_id: 1 });
donationSchema.index({ type: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ donor_id: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
