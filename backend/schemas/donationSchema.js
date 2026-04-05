const Joi = require('joi');

const submitDonationSchema = Joi.object({
  type: Joi.string()
    .valid('cash', 'food', 'shelter', 'medical', 'basic_needs')
    .required()
    .messages({
      'any.only': 'Donation type must be one of: cash, food, shelter, medical, basic_needs',
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
    currency: Joi.string().default('INR'),
    description: Joi.string().optional(),
    foodType: Joi.string().optional(),
    quantity: Joi.number().optional(),
    shelterType: Joi.string().optional(),
    duration: Joi.string().optional(),
    medicineType: Joi.string().optional(),
    doctorPermission: Joi.boolean().optional(),
    items: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional()
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
