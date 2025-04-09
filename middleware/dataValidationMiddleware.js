const Joi = require('joi');

const validateTableInput = (req, res, next) => {
  const schema = Joi.object({
    tableNumber: Joi.string().trim().required().messages({
      'string.empty': 'Table number is required.',
      'any.required': 'Table number is required.',
    }),
    capacity: Joi.number().integer().min(1).required().messages({
      'number.base': 'Table capacity must be a number.',
      'number.integer': 'Table capacity must be an integer.',
      'number.min': 'Table capacity must be at least 1.',
      'any.required': 'Table capacity is required.',
    }),
    location: Joi.string().trim().allow('').optional(), // Optional location
    isAvailable: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateReservationInput = (req, res, next) => {
  const schema = Joi.object({
    tableId: Joi.string().trim().required().messages({
      'string.empty': 'Table ID is required.',
      'any.required': 'Table ID is required.',
    }),
    customerName: Joi.string().trim().required().messages({
      'string.empty': 'Customer name is required.',
      'any.required': 'Customer name is required.',
    }),
    customerPhone: Joi.string().trim().allow('').optional(), // Optional
    reservationTime: Joi.date().iso().required().messages({
      'date.base': 'Reservation time must be a valid date.',
      'date.format': 'Reservation time must be in ISO 8601 format.',
      'any.required': 'Reservation time is required.',
    }),
    partySize: Joi.number().integer().min(1).required().messages({
      'number.base': 'Party size must be a number.',
      'number.integer': 'Party size must be an integer.',
      'number.min': 'Party size must be at least 1.',
      'any.required': 'Party size is required.',
    }),
    status: Joi.string()
      .valid('Pending', 'Confirmed', 'Seated', 'Cancelled')
      .optional(), // Optional
    notes: Joi.string().trim().allow('').optional(), // Optional
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
const validateRestaurantInfoInput = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(100).required().messages({
      'string.empty': 'Restaurant name is required.',
      'any.required': 'Restaurant name is required.',
      'string.max': 'Restaurant name cannot exceed 100 characters.',
    }),
    address: Joi.string().trim().max(200).allow('').optional().messages({
      'string.max': 'Address cannot exceed 200 characters.',
    }),
    phoneNumber: Joi.string().trim().max(20).allow('').optional().messages({
      'string.max': 'Phone number cannot exceed 20 characters.',
    }),
    openingHours: Joi.string().trim().max(200).allow('').optional().messages({
      'string.max': 'Opening hours cannot exceed 200 characters.',
    }),
    website: Joi.string()
      .trim()
      .uri({ scheme: ['http', 'https'] })
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Website must be a valid URL (e.g., http://example.com).',
        'string.max': 'Website URL cannot exceed 200 characters.',
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // const validationError = new Error(error.details[0].message);
    // validationError.statusCode = 400;
    // return next(validationError);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateReservationStatusInput = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(50).required().messages({
      'string.empty': 'Status name is required.',
      'any.required': 'Status name is required.',
      'string.max': 'Status name cannot exceed 50 characters.',
    }),
    description: Joi.string().trim().max(200).allow('').optional().messages({
      'string.max': 'Description cannot exceed 200 characters.',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateUserInput = (req, res, next) => {
  const schema = Joi.object({
    googleId: Joi.string().trim().required().messages({
      'string.empty': 'Google ID is required.',
      'any.required': 'Google ID is required.',
    }),
    name: Joi.string().trim().required().messages({
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.',
    }),
    email: Joi.string().trim().email().required().messages({
      'string.empty': 'Email is required.',
      'any.required': 'Email is required.',
      'string.email': 'Email must be a valid email address.',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateTableInput,
  validateReservationInput,
  validateRestaurantInfoInput,
  validateReservationStatusInput,
  validateUserInput,
};
