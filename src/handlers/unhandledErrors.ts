import { Request, Response, NextFunction } from "express";
import { HttpError } from '../errors';

export function createHandleUnhandledErrorsMiddleware() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    const error = HttpError.internalServerError();
    req.logger.error(`Unhandled error ${error}`, error.toJSON());
    return res.status(error.status).json(error);
  };
}
