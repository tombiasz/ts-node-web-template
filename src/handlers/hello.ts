import { Request, Response, NextFunction } from 'express';

export function createHelloHandler(name: string = 'world') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.query.error !== undefined) {
      return next(new Error('test'));
    }

    req.logger.info('Hello handler called')
    res.send(`hello, ${name}`);
  }
}
