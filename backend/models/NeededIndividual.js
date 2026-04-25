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

const neededIndividualSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^\d{10}$/, 'Phone must be 10 digits']
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
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
  trustScore: {
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
neededIndividualSchema.index({ status: 1 });
neededIndividualSchema.index({ urgency: 1 });
neededIndividualSchema.index({ 'address.city': 1 });
neededIndividualSchema.index({ trustScore: -1 });
neededIndividualSchema.index({ createdAt: -1 });
neededIndividualSchema.index({ 'address.geoLocation': '2dsphere' });

module.exports = mongoose.model('NeededIndividual', neededIndividualSchema);
