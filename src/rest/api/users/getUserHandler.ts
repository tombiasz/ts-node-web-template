import { Request } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler, createHandler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { UserJsonDBRepository } from './userRepository';
import { GetUser, UserNotFoundError } from '../../../domain/user/getUser';

export class GetUserHandler extends Handler {
  protected async _handle(req: Request) {
    const logger = req.logger;
    const db = req.db;

    const userRepo = new UserJsonDBRepository({ logger, db });

    try {
      const result = await new GetUser({ userRepo, logger }).execute({
        id: req.params.id,
      });

      return this.ok(UserSerializer.one(result));
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return this.fail(HttpError.notFound(error.message));
      }

      throw error;
    }
  }
}

export const createGetUserHandler = createHandler(GetUserHandler);
