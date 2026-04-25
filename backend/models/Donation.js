const mongoose = require('mongoose');

const proofDocumentSchema = new mongoose.Schema(
  {
    type: String,
    url: String,
    publicId: String,
    notes: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const donationSchema = new mongoose.Schema({
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor ID is required']
  },
  type: {
    type: String,
    enum: ['cash', 'food', 'shelter', 'medical', 'basic_needs', 'clothes', 'emergency', 'campaign'],
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
    details: String,
    name: String,
    phone: String,
    address: String,

    // For food donations
    foodType: String,
    quantity: Number,
    unit: String,
    isSurplusFood: { type: Boolean, default: false },
    foodSource: String,
    preparedAt: Date,
    expiresAt: Date,
    storageCondition: String,
    packaging: String,
    servings: Number,
    pickupWindowStart: Date,
    pickupWindowEnd: Date,
    pickupInstructions: String,

    // For shelter donations
    shelterType: String,
    duration: String,

    // For medical donations
    medicineType: String,
    doctorPermission: { type: Boolean, default: false },
    hasDocPermission: { type: Boolean, default: false },
    medicalDetails: String,

    // For basic needs and clothes
    items: [String],
    condition: String,
    clothingType: String,
    ageGroup: String,
    gender: String,
    sizes: [String],
    itemCount: Number,
    washed: { type: Boolean, default: false },

    // For emergency relief donations
    emergencyType: String,
    emergencyLocation: String,
    affectedPeopleCount: Number,
    requiredBy: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    reliefItems: [String],

    // For campaign proof workflows
    campaignId: String,
    campaignTitle: String,
    campaignOrganizer: String,
    proofType: String,
    proofUrl: String,
    proofPublicId: String,
    transactionReference: String,
    consentToVerify: { type: Boolean, default: false },

    // Uploaded proof or donation photos
    imageUrl: String,
    imagePublicId: String,
    proofDocuments: [proofDocumentSchema],

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
