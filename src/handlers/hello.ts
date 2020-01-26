import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';

export function createHelloHandler(name: string = 'world') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.query.error !== undefined) {
      return next(HttpError.notFound());
    }

    req.logger.info('Hello handler called')
    return res.json({ message: `hello, ${name}` });
  }
}
