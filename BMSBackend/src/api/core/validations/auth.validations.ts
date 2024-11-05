import { IUser } from '@dbinterfaces';
import * as Joi from 'joi';

const register: Joi.ObjectSchema<IUser> = Joi.object({ // Use 'Joi.object'
    first_name: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/) // Allowing spaces for multi-word first names
        .messages({
            'string.min': 'First name must be at least 3 characters long.',
            'string.max': 'First name must not exceed 50 characters.',
            'string.pattern.base': 'First name must only contain alphabetic characters and spaces.',
            'any.required': 'First name is required.',
        }),
    last_name: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/) // Allowing spaces for multi-word last names

        .messages({
            'string.min': 'Last name must be at least 3 characters long.',
            'string.max': 'Last name must not exceed 50 characters.',
            'string.pattern.base': 'Last name must only contain alphabetic characters and spaces.',
            'any.required': 'Last name is required.',
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .messages({
            'string.email': 'Email must be a valid email address.',
            'string.pattern.base': 'Email format is invalid.',
            'any.required': 'Email is required.',
        }),
    country_code: Joi.string()
        .pattern(/^\d{1,3}$/)
        .messages({
            'string.pattern.base': 'Country code must be 1 to 3 digits.',
            'any.required': 'Country code is required.',
        }),
    phone: Joi.string()
        .pattern(/^\d{10}$/) // Accepting only 10-digit numbers
        .optional() // Can be made required based on business logic
        .messages({
            'string.pattern.base': 'Phone number must be exactly 10 digits.',
        }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': `Password must be at least 8 characters long, 
                              contain at least one uppercase letter, 
                              one lowercase letter, 
                              one number, and one special character`,
        }),
    profile_url: Joi.string()
        .uri()
        .messages({
            'string.uri': 'Profile URL must be a valid URL.',
            'any.required': 'Profile URL is required.',
        }),
    status: Joi.number()
        .integer()
        .optional()
        .messages({
            'number.base': 'Status must be a number.',
            'number.integer': 'Status must be an integer.',
        }),
}).options({ abortEarly: false }); // Collect all errors before responding

export { register as Register };

