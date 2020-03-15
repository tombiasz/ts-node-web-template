import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler, createHandler } from '../../shared/handler';
import { UserSerializer } from './serializers';

type GetUserContext = {};

class GetUserHandler extends Handler<GetUserContext> {
  async handle(req: Request, res: Response): Promise<Response | void> {
    const { logger, repositories } = req.app.locals;
    const { id } = req.params;

    // TODO: validator
    if (!id) {
      throw HttpError.badRequest('user id is required');
    }

    const userRepo = repositories.userRepository;

    try {
      const user = userRepo.getById(id);

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
