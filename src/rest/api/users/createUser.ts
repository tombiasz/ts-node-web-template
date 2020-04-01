import { Request } from 'express';
import { Handler, createHandler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { CreateUser } from '../../../domain/user/createUser';
import { UserJsonDBRepository } from './userRepository';

export class CreateUserHandler extends Handler {
  protected async _handle(req: Request) {
    const logger = req.logger;
    const db = req.db;
    const userRepo = new UserJsonDBRepository({ logger, db });

    const user = await new CreateUser({
      logger,
      db,
      userRepo,
    }).execute(req.body);

    logger.info('new user created', { id: user.id });

    return this.ok(UserSerializer.one(user));
  }
}

export const createCreateUserHandler = createHandler(CreateUserHandler);
