import joi from '@hapi/joi';
import { createHandler, Handler } from './handler';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from './httpErrors';

type ValidatorProps = {
  schema: joi.Schema;
  options?: joi.ValidationOptions;
  path: 'body' | 'params';
};

const DEFAULT_JOI_OPTIONS = {
  stripUnknown: true,
  abortEarly: false,
};

export class ValidatorMiddleware extends Handler {
  private schema: joi.Schema;
  private options?: joi.ValidationOptions;
  private path: 'body' | 'params';

  constructor(props: ValidatorProps) {
    super();
    this.schema = props.schema;
    this.options = {
      ...DEFAULT_JOI_OPTIONS,
      ...props.options,
    };
    this.path = props.path;
  }

  async _handle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const result = this.schema.validate(req[this.path], this.options);

    if (result.error) {
      const error = HttpError.badRequest('bad request', result.error as object);

      return res.status(error.status).json(error.toJSON());
    }

    next();
  }
}

export const createBodyValidatorMiddleware = (
  props: Omit<ValidatorProps, 'path'>,
) => createHandler(ValidatorMiddleware)({ ...props, path: 'body' });

export const createParamsValidatorMiddleware = (
  props: Omit<ValidatorProps, 'path'>,
) => createHandler(ValidatorMiddleware)({ ...props, path: 'params' });
