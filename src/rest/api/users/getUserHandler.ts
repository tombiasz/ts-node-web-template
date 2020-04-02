import { Request } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler, createHandler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { UserJsonDBRepository } from './userRepository';
import { GetUser } from '../../../domain/user/getUser';

export class GetUserHandler extends Handler {
  protected async _handle(req: Request) {
    const logger = req.logger;
    const db = req.db;

    const userRepo = new UserJsonDBRepository({ logger, db });

    const result = await new GetUser({ userRepo, logger }).execute({
      id: req.params.id,
    });

    return result
      ? this.ok(UserSerializer.one(result))
      : this.fail(HttpError.notFound('user not found'));
  }
}

export const createGetUserHandler = createHandler(GetUserHandler);
