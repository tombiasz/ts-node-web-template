import { Request } from 'express';
import { Handler, HandlerFactory } from '../../shared/handler';
import { UserSerializer } from './serializers';
import {
  CreateUser,
  UsernameNotUniqueError,
} from '../../../domain/user/createUser';
import { UserJsonDBRepository } from './userRepository';
import { HttpError } from '../../shared/httpErrors';
import { Logger } from '../../../logger';

type CreateUserHandlerDependencies = {
  useCase: CreateUser;
  logger: Logger;
};

export class CreateUserHandler extends Handler {
  private useCase: CreateUser;

  private logger2: Logger;

  constructor({ useCase, logger }: CreateUserHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger2 = logger;
  }

  protected async _handle(req: Request) {
    try {
      const user = await this.useCase.execute(req.body);

      this.logger2.info('new user created', { id: user.id });

      return this.ok(UserSerializer.one(user));
    } catch (error) {
      if (error instanceof UsernameNotUniqueError) {
        return this.fail(HttpError.conflict(error.message));
      }

      throw error;
    }
  }
}

export const createUserHandlerFactory: HandlerFactory<CreateUserHandler> = req => {
  const logger = req.logger;
  const db = req.db;

  const userRepo = new UserJsonDBRepository({
    logger: logger.withContext({ repo: UserJsonDBRepository.name }),
    db,
  });

  const createUser = new CreateUser({
    db,
    logger: logger.withContext({ useCase: CreateUser.name }),
    userRepo,
  });

  return new CreateUserHandler({
    useCase: createUser,
    logger: logger.withContext({ handler: CreateUserHandler.name }),
  });
};
