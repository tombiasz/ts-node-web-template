import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../logger';
import { HttpError } from './httpErrors';

export abstract class Handler {
  private _req: Request | null = null;
  private _res: Response | null = null;
  private _next: NextFunction | null = null;
  private _logger: Logger | null = null;

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

  protected get logger() {
    if (!this._logger) {
      throw new Error('Logger is null. Did you call `handle`?');
    }

    return this._logger;
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

    this._req = req;
    this._res = res;
    this._next = next;
    this._logger = req.logger.setContext({
      handler: clsName,
    });

    this.logger.debug(`Calling handler ${clsName}`);

    return this._handle(req, res, next)
      .then(response => {
        this.logger.debug(`Returning from handler ${clsName}`);

        return response;
      })
      .catch(error => {
        this.logger.error(`Catching unhandled error in handler ${clsName}`, {
          error,
        });

        return next(error);
      });
  }

  protected ok(body?: object) {
    return body ? this.res.status(200).send(body) : this.res.status(200);
  }

  protected fail(error: HttpError) {
    return this.next(error);
  }
}

export function createHandler<TProps, THandler extends Handler>(
  cls: new (props: TProps) => THandler,
): (
  props: TProps,
) => (req: Request, res: Response, next: NextFunction) => void {
  return props => {
    const handler = new cls(props);

    return (req, res, next) => handler.handle(req, res, next);
  };
}
