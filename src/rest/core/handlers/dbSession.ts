import { Request, Response, NextFunction } from 'express';
import { createDbSession } from '@database/core';

export function createRequestDbSession() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.db = createDbSession({ logger: req.logger });
    next();
  };
}
