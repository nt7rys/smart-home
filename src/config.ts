import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
    PORT: Joi.number().default(3000),
});

export const envValidationOptions = {
    allowUnknown: false,
    abortEarly: false,
    stripUnknown: true,
    noDefaults: false
};
