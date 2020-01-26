import { Request, Response, NextFunction } from "express";
import { HttpError } from '../errors';

export function createHandleHttpErrorsMiddleware() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof HttpError)) {
      return next(err);
    }

    req.logger.error(`${err}`, err.toJSON());
    return res.status(err.status).json(err);
  };
}
