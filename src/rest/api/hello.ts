import { Request } from 'express';
import { HttpError } from '../shared/httpErrors';
import { Handler, createHandler } from '../shared/handler';

type HelloProps = {
  name: string;
};

class HelloHandler extends Handler {
  private name: string;

  constructor(props: HelloProps) {
    super();

    this.name = props.name;
  }

  protected async _handle(req: Request) {
    if (req.query.error !== undefined) {
      return this.fail(HttpError.badRequest('test', { file: __filename }));
    }

    this.logger.info('Hello handler called');

    return this.ok({ message: `hello, ${this.name}` });
  }
}

export const createHelloHandler = createHandler(HelloHandler);
