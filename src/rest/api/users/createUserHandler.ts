import { Request } from 'express';
import { Handler, HandlerFactory } from '../../shared/handler';
import { UserSerializer } from './serializers';
import {
  CreateUser,
  UsernameNotUniqueError,
} from '../../../domain/user/createUser';
import { UserJsonDBRepository } from './userRepository';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';

type CreateUserHandlerDependencies = {
  useCase: CreateUser;
  logger: ILogger;
};

export class CreateUserHandler extends Handler {
  private useCase: CreateUser;

  private logger: ILogger;

  constructor({ useCase, logger }: CreateUserHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const user = await this.useCase.execute(req.body);

      this.logger.info('new user created', { id: user.id });

      return this.ok(UserSerializer.one(user));
    } catch (error) {
      if (error instanceof UsernameNotUniqueError) {
        return this.fail(HttpError.conflict(error.message));
      }

      throw error;
    }
  }
}

export const createUserHandlerFactory: HandlerFactory<CreateUserHandler> = (
  req,
) => {
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
