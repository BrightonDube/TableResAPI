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
    status: Joi.string().valid('Pending', 'Confirmed', 'Seated', 'Cancelled').optional(), // Optional
    notes: Joi.string().trim().allow('').optional(), // Optional
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
    validateTableInput,
    validateReservationInput
};