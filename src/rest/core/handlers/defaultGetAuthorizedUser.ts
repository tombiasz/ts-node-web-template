import { Request, Response, NextFunction } from 'express';

export function createDefaultGetAuthorizedUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.getAuthorizedUser = () => {
      throw new Error(
        'Default getAuthorizedUser() request method should not be called! Did you forget to use authorization middleware?',
      );
    };

    next();
  };
}
