import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../shared/httpErrors';
import { Handler, createHandler, BaseProps } from '../shared/handler';

interface HelloProps extends BaseProps {
  name: string;
}

class HelloHandler extends Handler<HelloProps> {
  protected async _handle(req: Request) {
    if (req.query.error !== undefined) {
      return this.fail(HttpError.badRequest('test', { file: __filename }));
    }

    this.logger.info('Hello handler called');
    const { name } = this.props;

    return this.ok({ message: `hello, ${name}` });
  }
}

export const createHelloHandler = createHandler(HelloHandler);
