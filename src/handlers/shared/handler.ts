import { Request, Response, NextFunction } from "express";

export class Handler<TContext> {
  protected context: TContext

  constructor(context: TContext) {
    this.context = context;
  }

  handle(req: Request, res: Response) {
    throw new Error('not implemented');
  }

  public static asHandler<TContext>(
    this: new (context: TContext) => Handler<TContext>,
    context: TContext,
  ): (req: Request, res: Response, next: NextFunction) => void {
    const handler = new this(context);

    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        handler.handle(req, res);
      } catch(error) {
        const handlerName = this.name;
        req.logger.error(`Error in handler ${handlerName}`, {
          handlerName,
          error,
        });
        next(error);
      }
    }
  }
}
