import { Request, Response } from 'express';
import { HttpError } from '../../shared/httpErrors';

export function createRouteNotFoundHandler() {
  return (req: Request, res: Response) => {
    const error = HttpError.notFound();
    return res.status(error.status).json(error);
  }
}
