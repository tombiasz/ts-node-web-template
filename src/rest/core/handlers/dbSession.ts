import { Request, Response, NextFunction } from 'express';
import { createDbSession } from '@database/core';
import { IConfig } from '../../../config';

export function createRequestDbSession({ config }: { config: IConfig }) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.db = createDbSession({ config, logger: req.logger });
    next();
  };
}
