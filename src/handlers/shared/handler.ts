import { Request, Response, NextFunction } from "express";

export abstract class Handler<TContext extends object = {}> {
	constructor(
		protected context: TContext = {} as TContext,
	) {}

  abstract async handle(req: Request, res: Response): Promise<Response | void>
}

export function createHandler<TContext extends object, THandler extends Handler<TContext>>(
	cls: new (context?: TContext) => THandler,
): (
  context?: TContext
) => (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void> {
	return (context?: TContext) => {
    const handler = new cls(context);

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await handler.handle(req, res);
        return result;
      } catch(error) {
        req.logger.error(`Error handler in ${cls.name}`, { handler: cls.name, error });
        return next(error);
      }
    }
  }
}
