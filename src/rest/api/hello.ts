import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../shared/httpErrors';
import { Handler, createHandler} from '../shared/handler';

type HelloHandlerContext = {
	name: string
}

class HelloHandler extends Handler<HelloHandlerContext> {
  async handle(req: Request, res: Response): Promise<Response | void> {
    const { logger } = req.app.locals;

    if (req.query.error !== undefined) {
      throw HttpError.badRequest('test', { file: __filename });
    }

    logger.info('Hello handler called')
    const { name } = this.context;

    return res.json({ message: `hello, ${name}` });
	}
}

export const createHelloHandler = createHandler(HelloHandler);
