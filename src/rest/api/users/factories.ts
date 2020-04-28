import { HandlerFactory } from '../../shared/handler';
import { UserJsonDbRepository } from '../../../database/users/userJsonDbRepository';
import { GetUser, CreateUser } from '@app/user';
import { CreateUserHandler } from './createUserHandler';
import { GetUserHandler } from './getUserHandler';

export const createUserHandlerFactory: HandlerFactory<CreateUserHandler> = (
  req,
) => {
  const logger = req.logger;
  const db = req.db;

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
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

export const getUserHandlerFactory: HandlerFactory<GetUserHandler> = (req) => {
  const logger = req.logger;
  const db = req.db;

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
    db,
  });

  const createUser = new GetUser({
    logger: logger.withContext({ useCase: GetUser.name }),
    userRepo,
  });

  return new GetUserHandler({
    useCase: createUser,
    logger: logger.withContext({ handler: GetUserHandler.name }),
  });
};
