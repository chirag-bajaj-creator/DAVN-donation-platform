const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    immutable: true
  },
  type: {
    type: String,
    enum: ['specialized', 'unspecialized'],
    required: [true, 'Volunteer type is required']
  },
  specialization: {
    type: String,
    enum: [null, 'Medical', 'Logistics', 'Management', 'Education', 'Other'],
    default: null,
    required: function() {
      return this.type === 'specialized';
    }
  },
  documents: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active'],
    default: 'pending'
  },
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
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

// Auto-approve unspecialized volunteers in pre-save hook
volunteerSchema.pre('save', async function(next) {
  try {
    if (this.type === 'unspecialized' && this.status === 'pending') {
      this.status = 'active';
      this.verifiedAt = new Date();
    }
    this.updatedAt = new Date();
    next();
  } catch (err) {
    next(err);
  }
});

// Indexes
volunteerSchema.index({ user_id: 1 });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ type: 1 });
volunteerSchema.index({ createdAt: -1 });
volunteerSchema.index({ rating: -1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);
