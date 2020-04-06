import { Request } from 'express';
import { Handler, createHandler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import {
  CreateUser,
  UsernameNotUniqueError,
} from '../../../domain/user/createUser';
import { UserJsonDBRepository } from './userRepository';
import { HttpError } from '../../shared/httpErrors';

export class CreateUserHandler extends Handler {
  protected async _handle(req: Request) {
    const logger = req.logger;
    const db = req.db;
    const userRepo = new UserJsonDBRepository({ logger, db });

    try {
      const user = await new CreateUser({
        logger,
        db,
        userRepo,
      }).execute(req.body);

      logger.info('new user created', { id: user.id });

      return this.ok(UserSerializer.one(user));
    } catch (error) {
      if (error instanceof UsernameNotUniqueError) {
        return this.fail(HttpError.conflict(error.message));
      }

      throw error;
    }
  }
}

export const createCreateUserHandler = createHandler(CreateUserHandler);
