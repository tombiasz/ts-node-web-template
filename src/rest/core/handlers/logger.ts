import * as uuid from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../logger';

export function createRequestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.logger = logger.withContext({
      requestId: uuid.v4(),
    });
    next();
  };
}
