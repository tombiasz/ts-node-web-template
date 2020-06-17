import Joi = require('@hapi/joi');
import { createBodyValidatorMiddleware } from '../../shared/validator';

export const createAuctionSchema = Joi.object({
  title: Joi.string().min(10).max(120).trim().required(),
  description: Joi.string().max(400).trim().required(),
  startingPrice: Joi.number().integer().min(0).max(1000000),
  images: Joi.array()
    .items(
      Joi.object({
        path: Joi.string().min(1).max(100).trim().required(),
        description: Joi.string().min(1).max(100).trim().optional(),
      }),
    )
    .min(1)
    .max(6)
    .required(),
  featuredImage: Joi.string().min(1).max(100).trim().optional(),
});

export const createCreateAuctionValidator = () =>
  createBodyValidatorMiddleware({
    schema: createAuctionSchema,
  });
