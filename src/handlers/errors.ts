import { Request, Response, NextFunction } from "express";
import { HttpError } from '../errors';

export function createHandleErrorsMiddleware() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof HttpError)) {
      return next(err);
    }

    req.logger.error(`${err}`, err.toJSON());
    res.status(err.status).send(err.toJSON());
  };
}
