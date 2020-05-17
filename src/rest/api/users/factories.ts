import { UserActivationJsonDbRepository } from '@database/userActivation/userActivationJsonDbRepository';
import { TimeProvider } from '@utils/timeProvider';
import { PasswordManager } from '@utils/passwordManager';
import { HandlerFactory } from '../../shared/handler';
import { UserJsonDbRepository } from '../../../database/users/userJsonDbRepository';
import {
  CreateUser,
  RegisterUser,
  ActivateUser,
  CreateUserData,
  RegisterUserData,
  ActivateUserData,
} from '@app/users';
import { CreateUserHandler } from './createUserHandler';
import { GetUserHandler } from './getUserHandler';
import { RegisterUserHandler } from './registerUserHandler';
import { ActivateUserHandler } from './activateUserHandler';
import { UseCaseWithTransaction } from '@database/core/useCaseWithTransaction';
import { User } from '@domain/user';
import { createDbSession } from '@database/core';
import { config } from '../../../config';

export const createUserHandlerFactory: HandlerFactory<CreateUserHandler> = (
  req,
) => {
  const logger = req.logger;

  const db = createDbSession({ databaseName: config.databaseName });

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
    db,
  });

  const createUser = new UseCaseWithTransaction<CreateUserData, User>({
    db,
    useCase: new CreateUser({
      logger: logger.withContext({ useCase: CreateUser.name }),
      userRepo,
      timeProvider: new TimeProvider(),
      passwordHashCalculator: new PasswordManager(),
    }),
  });

  return new CreateUserHandler({
    useCase: createUser,
    logger: logger.withContext({ handler: CreateUserHandler.name }),
  });
};

export const getUserHandlerFactory: HandlerFactory<GetUserHandler> = (req) => {
  const logger = req.logger;

  const db = createDbSession({ databaseName: config.databaseName });

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
    db,
  });

  return new GetUserHandler({
    userRepo,
    logger: logger.withContext({ handler: GetUserHandler.name }),
  });
};

export const registerUserHandlerFactory: HandlerFactory<RegisterUserHandler> = (
  req,
) => {
  const logger = req.logger;

  const db = createDbSession({ databaseName: config.databaseName });

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
    db,
  });
  const userActivationRepo = new UserActivationJsonDbRepository({
    logger: logger.withContext({ repo: UserActivationJsonDbRepository.name }),
    db,
  });

  const registerUser = new UseCaseWithTransaction<RegisterUserData, User>({
    db,
    useCase: new RegisterUser({
      logger: logger.withContext({ useCase: RegisterUser.name }),
      userRepo,
      userActivationRepo,
      timeProvider: new TimeProvider(),
      passwordHashCalculator: new PasswordManager(),
    }),
  });

  return new RegisterUserHandler({
    useCase: registerUser,
    logger: logger.withContext({ handler: GetUserHandler.name }),
  });
};

export const activateUserHandlerFactory: HandlerFactory<ActivateUserHandler> = (
  req,
) => {
  const logger = req.logger;

  const db = createDbSession({ databaseName: config.databaseName });

  const userRepo = new UserJsonDbRepository({
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
    db,
  });
  const userActivationRepo = new UserActivationJsonDbRepository({
    logger: logger.withContext({ repo: UserActivationJsonDbRepository.name }),
    db,
  });

  const activateUser = new UseCaseWithTransaction<ActivateUserData, void>({
    db,
    useCase: new ActivateUser({
      logger: logger.withContext({ useCase: ActivateUser.name }),
      userRepo,
      userActivationRepo,
      timeProvider: new TimeProvider(),
    }),
  });

  return new ActivateUserHandler({
    useCase: activateUser,
    logger: logger.withContext({ handler: GetUserHandler.name }),
  });
};
