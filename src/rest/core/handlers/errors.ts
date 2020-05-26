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

      logger.error(`Unhandled error`, error);

      const _error = HttpError.internalServerError();
      return res.status(_error.status).json(_error);
    } catch (err) {
      logger.error(`Error when handling errors`, error);

      const _error = HttpError.internalServerError();
      return res.status(_error.status).json(_error);
    }
  };
}
