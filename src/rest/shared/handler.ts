import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../../logger';
import { HttpError } from './httpErrors';

export abstract class Handler {
  private _req: Request | null = null;
  private _res: Response | null = null;
  private _next: NextFunction | null = null;

  protected get req() {
    if (!this._req) {
      throw new Error('Request is null. Did you call `handle`?');
    }

    return this._req;
  }

  protected get res() {
    if (!this._res) {
      throw new Error('Response is null. Did you call `handle`?');
    }

    return this._res;
  }

  protected get next() {
    if (!this._next) {
      throw new Error('NextFunction is null. Did you call `handle`?');
    }

    return this._next;
  }

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
    const clsName = this.constructor.name;
    const logger = req.logger;

    this._req = req;
    this._res = res;
    this._next = next;

    logger.debug(`Calling handler ${clsName}`);

    return this._handle(req, res, next)
      .then((response) => {
        logger.debug(`Returning from handler ${clsName}`);

        return response;
      })
      .catch((error) => {
        logger.error(`Catching unhandled error in handler ${clsName}`, {
          error,
        });

        return next(error);
      });
  }

  protected ok(body?: object) {
    return body ? this.res.status(200).send(body) : this.res.status(200).end();
  }

  protected fail(error: HttpError) {
    return this.next(error);
  }

  static extendLoggerWithContext(logger: ILogger) {
    return logger.withContext({
      handler: this.name,
    });
  }
}

export function createHandler<TProps, THandler extends Handler>(
  cls: new (props: TProps) => THandler,
): (
  props: TProps,
) => (req: Request, res: Response, next: NextFunction) => void {
  return (props) => {
    const handler = new cls(props);

    return (req, res, next) => handler.handle(req, res, next);
  };
}

export type HandlerFactory<THandler extends Handler> = (
  req: Request,
) => THandler;

export function asHandler<THandler extends Handler>(
  factory: HandlerFactory<THandler>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const handler = factory(req);

    handler.handle(req, res, next);
  };
}
