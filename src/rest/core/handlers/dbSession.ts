import { Request, Response, NextFunction } from 'express';
import { IConfig } from '../../../config';
import { createDbSession } from '../../../dbSession';

export function createRequestDbSession({ config }: { config: IConfig }) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.db = createDbSession({ config, logger: req.logger });
    next();
  };
}
