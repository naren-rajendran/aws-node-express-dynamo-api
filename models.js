const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const userSchema = Joi.object({
    userId: Joi.string().guid({ version: 'uuidv4' }).required(),
    firstName: Joi.string().lowercase().max(30).required(),
    lastName: Joi.string().lowercase().max(30).required(),
    email: Joi.string().lowercase().email({ tlds: { allow: false } }).required(),
    dateOfBirth: Joi.date().greater('1-1-1900').max('now').optional(),
    phone: Joi.string().regex(/^\d+$/).min(10).max(20).optional().messages({
        'string.pattern.base': 'phone should only contain numbers'
    }), //could be from any country
    address: Joi.string().lowercase().max(100).optional(),
    city: Joi.string().lowercase().max(30).optional(),
    state: Joi.string().lowercase().max(30).optional(), // short or long form
    country: Joi.string().lowercase().max(30).optional(),
    zipCode: Joi.string().regex(/^\d+$/).min(5).max(10).optional().messages({
        'string.pattern.base': 'zip code should only contain numbers'
    }) //could be from any country
});

function validateUserData(data) {
    const { phone, zipCode } = data;
    const userData = Object.assign({}, data, {
        userId: uuidv4(),
        phone: phone ? phone.toString() : '',
        zipCode: zipCode ? zipCode.toString() : '',
    });
    const result = userSchema.validate(userData, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });
    return result;
}

modules.export = {
    validateUserData,
};
