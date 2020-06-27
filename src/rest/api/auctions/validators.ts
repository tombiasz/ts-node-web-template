import Joi = require('@hapi/joi');
import {
  createBodyValidatorMiddleware,
  createParamsValidatorMiddleware,
} from '../../shared/validator';
import { AuctionItem } from '@app/auctions/domain/auction';

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
    .max(AuctionItem.MAX_IMAGES)
    .required(),
  featuredImage: Joi.string().min(1).max(100).trim().optional(),
});

export const auctionIdSchema = Joi.object({
  auctionId: Joi.string().guid({ version: 'uuidv4' }).required(),
});

export const withdrawAuctionSchema = Joi.object({
  reason: Joi.string().min(3).max(140).trim().required(),
});

export const createCreateAuctionValidator = () =>
  createBodyValidatorMiddleware({
    schema: createAuctionSchema,
  });

export const createAuctionIdValidator = () =>
  createParamsValidatorMiddleware({
    schema: auctionIdSchema,
  });

export const createWithdrawnAuctionValidator = () =>
  createBodyValidatorMiddleware({
    schema: withdrawAuctionSchema,
  });
