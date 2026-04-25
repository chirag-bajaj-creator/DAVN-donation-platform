const Joi = require('joi');

const optionalString = Joi.string().trim().empty('').optional();
const optionalUri = Joi.string().trim().uri().empty('').optional();

const submitDonationSchema = Joi.object({
  type: Joi.string()
    .valid('cash', 'food', 'shelter', 'medical', 'basic_needs', 'clothes', 'emergency', 'campaign')
    .required()
    .messages({
      'any.only': 'Donation type must be one of: cash, food, shelter, medical, basic_needs, clothes, emergency, campaign',
      'any.required': 'Donation type is required'
    }),
  amount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Amount must be greater than 0',
      'any.required': 'Amount is required'
    }),
  details: Joi.object({
    currency: optionalString.default('INR'),
    description: optionalString,
    details: optionalString,
    name: optionalString,
    phone: optionalString,
    address: optionalString,
    foodType: optionalString,
    quantity: Joi.number().positive().optional(),
    unit: optionalString,
    isSurplusFood: Joi.boolean().optional(),
    foodSource: optionalString,
    preparedAt: Joi.date().optional(),
    expiresAt: Joi.date().optional(),
    storageCondition: optionalString,
    packaging: optionalString,
    servings: Joi.number().integer().positive().optional(),
    pickupWindowStart: Joi.date().optional(),
    pickupWindowEnd: Joi.date().optional(),
    pickupInstructions: optionalString,
    shelterType: optionalString,
    duration: optionalString,
    medicineType: optionalString,
    doctorPermission: Joi.boolean().optional(),
    hasDocPermission: Joi.boolean().optional(),
    medicalDetails: optionalString,
    items: Joi.array().items(optionalString).optional(),
    condition: optionalString,
    clothingType: optionalString,
    ageGroup: optionalString,
    gender: optionalString,
    sizes: Joi.array().items(optionalString).optional(),
    itemCount: Joi.number().integer().positive().optional(),
    washed: Joi.boolean().optional(),
    emergencyType: optionalString,
    emergencyLocation: optionalString,
    affectedPeopleCount: Joi.number().integer().positive().optional(),
    requiredBy: Joi.date().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    reliefItems: Joi.array().items(optionalString).optional(),
    campaignId: optionalString,
    campaignTitle: optionalString,
    campaignOrganizer: optionalString,
    proofType: optionalString,
    proofUrl: optionalUri,
    proofPublicId: optionalString,
    transactionReference: optionalString,
    consentToVerify: Joi.boolean().optional(),
    imageUrl: optionalUri,
    imagePublicId: optionalString,
    proofDocuments: Joi.array().items(
      Joi.object({
        type: optionalString,
        url: Joi.string().trim().uri().required(),
        publicId: optionalString,
        notes: optionalString,
        uploadedAt: Joi.date().optional()
      })
    ).optional(),
    notes: optionalString
  }).optional()
});

const updateDonationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('submitted', 'verified', 'in_delivery', 'completed')
    .required()
    .messages({
      'any.only': 'Status must be one of: submitted, verified, in_delivery, completed',
      'any.required': 'Status is required'
    })
});

module.exports = {
  submitDonationSchema,
  updateDonationStatusSchema
};
