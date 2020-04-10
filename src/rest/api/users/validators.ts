import Joi = require('@hapi/joi');
import {
  createBodyValidatorMiddleware,
  createParamsValidatorMiddleware,
} from '../../shared/validator';

export const getUserSchema = Joi.object({
  id: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
});

export const createUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
});

export const createGetUserValidator = () =>
  createParamsValidatorMiddleware({
    schema: getUserSchema,
  });

export const createCreateUserValidator = () =>
  createBodyValidatorMiddleware({
    schema: createUserSchema,
  });
