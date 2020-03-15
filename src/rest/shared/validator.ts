import joi from '@hapi/joi';
import { createMiddleware, Middleware } from './middleware';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from './httpErrors';

type ValidatorContext = {
  schema: joi.Schema;
  options?: joi.ValidationOptions;
  path: 'body' | 'params';
};

const DEFAULT_JOI_OPTIONS = {
  stripUnknown: true,
  abortEarly: false,
};

export class ValidatorMiddleware extends Middleware<ValidatorContext> {
  async handle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { schema, options, path } = this.context;

    const result = schema.validate(req[path], {
      ...DEFAULT_JOI_OPTIONS,
      ...options,
    });

    if (result.error) {
      const error = HttpError.badRequest('bad request', result.error as object);

      return res.status(error.status).json(error.toJSON());
    }

    next();
  }
}

export const createBodyValidatorMiddleware = (
  context: Omit<ValidatorContext, 'path'>,
) => createMiddleware(ValidatorMiddleware)({ ...context, path: 'body' });

export const createParamsValidatorMiddleware = (
  context: Omit<ValidatorContext, 'path'>,
) => createMiddleware(ValidatorMiddleware)({ ...context, path: 'params' });
