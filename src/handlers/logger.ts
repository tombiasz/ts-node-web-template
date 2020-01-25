import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger';

export function createAttachLoggerMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
      req.logger = logger;
      next();
  }
}
