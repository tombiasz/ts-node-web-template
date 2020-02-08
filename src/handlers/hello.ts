import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import { Handler } from './shared/handler';

type HelloHandlerContext = {
  name: string;
};

export class HelloHandler extends Handler<HelloHandlerContext> {
  handle(req: Request, res: Response) {
    if (req.query.error !== undefined) {
      throw HttpError.notFound();
    }

    req.logger.info('Hello handler called')
    const { name } = this.context;

    return res.json({ message: `hello, ${name}` });
  }
}
