import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler, createHandler } from '../../shared/handler';
import { User } from '../../../domain/user/user';

type CreateUserContext = {};

class CreateUserHandler extends Handler<CreateUserContext> {
  async handle(req: Request, res: Response): Promise<Response | void> {
    const { logger, repositories } = req.app.locals;
    // TODO: validator
    const { id, username, password } = req.body;

    const user = new User({
      id, // TODO: generate id
      username,
      password, // TODO: password hashing
    });

    const userRepo = repositories.userRepository;
    userRepo.save(user);

    logger.info('new user created', { id: user.id });

    // TODO: serializer
    return res.json({ user });
  }
}

export const createCreateUserHandler = createHandler(CreateUserHandler);
