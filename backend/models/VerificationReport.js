const mongoose = require('mongoose');

const verificationReportSchema = new mongoose.Schema({
  needy_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Needy ID is required']
  },
  needy_type: {
    type: String,
    enum: ['NeededIndividual', 'NeededOrganization'],
    required: [true, 'Needy type is required']
  },
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Verifier ID is required']
  },
  status: {
    type: String,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending'
  },
  verificationDetails: {
    documentVerified: { type: Boolean, default: false },
    addressVerified: { type: Boolean, default: false },
    identityVerified: { type: Boolean, default: false },
    comments: String,
    issues: [String]
  },
  trustScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  recommendation: {
    type: String,
    enum: ['approve', 'reject', 'hold'],
    required: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
verificationReportSchema.index({ needy_id: 1 });
verificationReportSchema.index({ verified_by: 1 });
verificationReportSchema.index({ status: 1 });
verificationReportSchema.index({ trustScore: -1 });
verificationReportSchema.index({ createdAt: -1 });

// Make collection immutable - prevent updates and deletes on specific fields
verificationReportSchema.pre('findByIdAndUpdate', function(next) {
  // Log when someone tries to update a verified report
  if (this.getFilter()._id) {
    console.warn('⚠ Attempted update to immutable VerificationReport');
  }
  next();
});

module.exports = mongoose.model('VerificationReport', verificationReportSchema);
