import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../logger';
import { HttpError } from './httpErrors';

export interface BaseProps {
  logger: Logger;
}

export abstract class Handler<TProps extends BaseProps> {
  private _req: Request | null = null;
  private _res: Response | null = null;
  private _next: NextFunction | null = null;

  protected get req() {
    if (!this._req) {
      throw new Error('Request is null');
    }

    return this._req;
  }

  protected get res() {
    if (!this._res) {
      throw new Error('Response is null');
    }

    return this._res;
  }

  protected get next() {
    if (!this._next) {
      throw new Error('NextFunction is null');
    }

    return this._next;
  }

  protected get logger() {
    return this.req.logger;
  }

  constructor(protected props: TProps) {}

  protected abstract async _handle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;

  public handle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    this._req = req;
    this._res = res;
    this._next = next;

    return this._handle(req, res, next).catch(error => {
      const clsName = this.constructor.name;

      this.logger.error(`Error in handler ${clsName}`, {
        handler: clsName,
        error,
      });

      return next(error);
    });
  }

  ok(body?: object) {
    return body ? this.res.status(200).send(body) : this.res.status(200);
  }

  fail(error: HttpError) {
    return this.next(error);
  }
}

export function createHandler<
  TProps extends BaseProps,
  THandler extends Handler<TProps>
>(
  cls: new (props: TProps) => THandler,
): (
  props: TProps,
) => (req: Request, res: Response, next: NextFunction) => void {
  return props => {
    const handler = new cls(props);

    return (req, res, next) => handler.handle(req, res, next);
  };
}
