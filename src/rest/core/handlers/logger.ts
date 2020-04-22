import * as uuid from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../../../logger';

export function createRequestLogger({ logger }: { logger: ILogger }) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.logger = logger.withContext({
      requestId: uuid.v4(),
    });
    next();
  };
}
