import { Request, Response, NextFunction } from "express";
import { HttpError } from '../errors';

export function createHandleJSONErrorsMiddleware() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof SyntaxError)) {
      return next(err);
    }

    const error = HttpError.badRequest('invalid JSON');
    req.logger.error(`${error}`, error.toJSON());
    return res.status(error.status).json(error);
  };
}
