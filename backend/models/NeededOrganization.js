const mongoose = require('mongoose');

const geoLocationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: undefined
    },
    lat: Number,
    lng: Number,
    accuracy: Number,
    source: String,
    capturedAt: Date
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['not_assigned', 'assigned', 'accepted', 'in_route', 'completed', 'cancelled'],
      default: 'not_assigned'
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    lastVolunteerLocation: geoLocationSchema
  },
  { _id: false }
);

const neededOrganizationSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: [true, 'Organization name is required']
  },
  registration_number: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true
  },
  org_type: {
    type: String,
    enum: ['ngo', 'charity', 'trust', 'foundation', 'government', 'other'],
    required: [true, 'Organization type is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^\d{10}$/, 'Phone must be 10 digits']
  },
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: String,
    zipCode: String,
    geoLocation: geoLocationSchema
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  type_of_need: {
    type: String,
    enum: ['food', 'shelter', 'medical', 'basic_needs', 'education', 'employment', 'disaster_relief'],
    required: [true, 'Type of need is required']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  documents: [
    {
      type: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  credibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  requested_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tracking: {
    type: trackingSchema,
    default: () => ({})
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

// Indexes
neededOrganizationSchema.index({ registration_number: 1 });
neededOrganizationSchema.index({ status: 1 });
neededOrganizationSchema.index({ credibilityScore: -1 });
neededOrganizationSchema.index({ createdAt: -1 });
neededOrganizationSchema.index({ 'address.geoLocation': '2dsphere' });

module.exports = mongoose.model('NeededOrganization', neededOrganizationSchema);
