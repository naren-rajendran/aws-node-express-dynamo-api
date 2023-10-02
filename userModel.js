const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const userSchema = Joi.object({
    userId: Joi.string().guid({ version: 'uuidv4' }).required(),
    firstName: Joi.string().lowercase().max(30).required(),
    lastName: Joi.string().lowercase().max(30).required(),
    email: Joi.string().lowercase().email({ tlds: { allow: false } }).required(),
    dateOfBirth: Joi.date().greater('1-1-1900').max('now').optional(),
    phone: Joi.string().regex(/^\d+$/).min(10).max(20).allow('').optional().messages({
        'string.pattern.base': 'phone should only contain numbers'
    }), //could be from any country
    address: Joi.string().lowercase().max(100).optional(),
    city: Joi.string().lowercase().max(30).optional(),
    state: Joi.string().lowercase().max(30).optional(), // short or long form
    country: Joi.string().lowercase().max(30).optional(),
    zipCode: Joi.string().regex(/^\d+$/).max(10).allow('').optional().messages({
        'string.pattern.base': 'zip code should only contain numbers'
    }) //could be from any country
});

function validateUserData(data) {
    const { phone, zipCode } = data;
    data.phone = phone ? phone.toString() : '';
    data.zipCode = zipCode ? zipCode.toString() : '';
    const userData = Object.assign({}, {
        userId: uuidv4(),
    }, data);
    const result = userSchema.validate(userData, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });
    return {
        user: result.value,
        error: result.error?.details.map(e => e.message),
    };
}

module.exports = {
    validateUserData,
};
