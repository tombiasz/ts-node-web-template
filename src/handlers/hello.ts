import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import { Handler, createHandler} from './shared/handler';

type HelloHandlerContext = {
	name: string
}

class HelloHandler extends Handler<HelloHandlerContext> {
  async handle(req: Request, res: Response): Promise<Response | void> {
    if (req.query.error !== undefined) {
      throw HttpError.notFound();
    }

    req.logger.info('Hello handler called')
    const { name } = this.context;

    return res.json({ message: `hello, ${name}` });
	}
}

export const createHelloHandler = createHandler(HelloHandler);
