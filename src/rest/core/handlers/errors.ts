import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../shared/httpErrors';

const isHttpError = (error: any) => error instanceof HttpError;
const isSyntaxError = (error: any) => error instanceof SyntaxError;

export function createErrorsHandler() {
  return (error: any, req: Request, res: Response, next: NextFunction) => {
    const { logger } = req;

    try {
      if (isHttpError(error)) {
        logger.error(`${error}`, error.toJSON());
        return res.status(error.status).json(error);
      }

      if (isSyntaxError(error)) {
        const _error = HttpError.badRequest('invalid JSON');
        logger.error(`${_error}`, _error.toJSON());
        return res.status(_error.status).json(_error);
      }

      const _error = HttpError.internalServerError();
      logger.error(`Unhandled error ${_error}`, _error.toJSON());
      return res.status(_error.status).json(_error);
    } catch (err) {
      const _error = HttpError.internalServerError();
      logger.error(`Error when handling errors ${_error}`, _error.toJSON());
      return res.status(_error.status).json(_error);
    }
  };
}
