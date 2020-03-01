import { Request, Response, NextFunction } from "express";

export abstract class Middleware<TContext extends object = {}> {
  constructor(protected context: TContext = {} as TContext) {}

  abstract async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export function createMiddleware<
  TContext extends object,
  TMiddleware extends Middleware<TContext>
>(
  cls: new (context?: TContext) => TMiddleware
): (
  context?: TContext
) => (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void> {
  return (context?: TContext) => {
    const middleware = new cls(context);

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await middleware.handle(req, res, next);

        return result;
      } catch (error) {
        const { logger } = req.app.locals;

        logger.error(`Error in middleware ${cls.name}`, {
          middleware: cls.name,
          error
        });

        return next(error);
      }
    };
  };
}
