import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';

export function createUnknownRouteHandler() {
  return (req: Request, res: Response, next: NextFunction) => {
    const error = HttpError.notFound();
    return res.status(error.status).json(error);
  }
}
