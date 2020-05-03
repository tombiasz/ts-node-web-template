import { HandlerFactory } from '../../shared/handler';
import { UserJsonDbRepository } from '../../../database/users/userJsonDbRepository';
import { GetUser, CreateUser, RegisterUser } from '@app/users';
import { CreateUserHandler } from './createUserHandler';
import { GetUserHandler } from './getUserHandler';
import { RegisterUserHandler } from './registerUserHandler';
import { UserActivationJsonDbRepository } from '@database/userActivation/userActivationJsonDbRepository';
import { TimeProvider } from '@utils/timeProvider';

export const createUserHandlerFactory: HandlerFactory<CreateUserHandler> = (
  req,
) => {
  const logger = req.logger;
  const db = req.db;

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
    db,
  });

  const timeProvider = new TimeProvider();

  const createUser = new CreateUser({
    db,
    logger: logger.withContext({ useCase: CreateUser.name }),
    userRepo,
    timeProvider,
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

export const registerUserHandlerFactory: HandlerFactory<RegisterUserHandler> = (
  req,
) => {
  const logger = req.logger;
  const db = req.db;

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
    db,
  });
  const userActivationRepo = new UserActivationJsonDbRepository({
    logger: logger.withContext({ repo: UserActivationJsonDbRepository.name }),
    db,
  });

  const timeProvider = new TimeProvider();

  const useCase = new RegisterUser({
    logger: logger.withContext({ useCase: RegisterUser.name }),
    db,
    userRepo,
    userActivationRepo,
    timeProvider,
  });

  return new RegisterUserHandler({
    useCase,
    logger: logger.withContext({ handler: GetUserHandler.name }),
  });
};
