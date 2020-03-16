import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler, createHandler } from '../../shared/handler';
import { UserSerializer } from './serializers';

type GetUserContext = {};

class GetUserHandler extends Handler<GetUserContext> {
  async handle(req: Request, res: Response): Promise<Response | void> {
    const { logger, db } = req.app.locals;
    const { id } = req.params;

    try {
      const user = db.users.getById(id);

      return res.json(UserSerializer.one(user));
    } catch (error) {
      logger.error('user not found', {
        filename: __filename,
        userId: id,
        error,
      });
      throw HttpError.notFound('user not found');
    }
  }
}

export const createGetUserHandler = createHandler(GetUserHandler);
