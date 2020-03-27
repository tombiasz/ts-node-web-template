import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../logger';

export function createRequestContext({ logger }: { logger: Logger }) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.logger = logger;
    next();
  };
}
