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

module.exports = {
    
    validateTableInput, 
};