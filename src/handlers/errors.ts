import { Request, Response, NextFunction } from "express";

export default function errorsHandler() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    req.logger.error(`${err}`);
    next(err);
  };
}
