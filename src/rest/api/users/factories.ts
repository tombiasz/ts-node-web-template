import { TimeProvider } from '@utils/timeProvider';
import { PasswordManager } from '@utils/passwordManager';
import { HandlerFactory } from '../../shared/handler';
import { createUserRepository } from '@database/users';
import { createUserActivationRepository } from '@database/userActivation';
import {
  CreateUser,
  RegisterUser,
  ActivateUser,
  CreateUserData,
  RegisterUserData,
  ActivateUserData,
  Authenticate,
} from '@app/users';
import { CreateUserHandler } from './createUserHandler';
import { GetUserHandler } from './getUserHandler';
import { RegisterUserHandler } from './registerUserHandler';
import { ActivateUserHandler } from './activateUserHandler';
import { UseCaseWithTransaction } from '@database/core/useCaseWithTransaction';
import { User } from '@domain/user';
import { db } from '@database/core';
import { AuthenticateHandler } from './authenticateHandler';

export const createUserHandlerFactory: HandlerFactory<CreateUserHandler> = (
  req,
) => {
  const logger = req.logger;

  const createUser = new UseCaseWithTransaction<CreateUserData, User>({
    db,
    useCase: new CreateUser({
      logger: logger.withContext({ useCase: CreateUser.name }),
      userRepo: createUserRepository({ logger }),
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

  return new GetUserHandler({
    userRepo: createUserRepository({ logger }),
    logger: logger.withContext({ handler: GetUserHandler.name }),
  });
};

export const registerUserHandlerFactory: HandlerFactory<RegisterUserHandler> = (
  req,
) => {
  const logger = req.logger;

  const registerUser = new UseCaseWithTransaction<RegisterUserData, User>({
    db,
    useCase: new RegisterUser({
      logger: logger.withContext({ useCase: RegisterUser.name }),
      userRepo: createUserRepository({ logger }),
      userActivationRepo: createUserActivationRepository({ logger }),
      timeProvider: new TimeProvider(),
      passwordHashCalculator: new PasswordManager(),
    }),
  });

  return new RegisterUserHandler({
    useCase: registerUser,
    logger: logger.withContext({ handler: RegisterUserHandler.name }),
  });
};

export const activateUserHandlerFactory: HandlerFactory<ActivateUserHandler> = (
  req,
) => {
  const logger = req.logger;

  const activateUser = new UseCaseWithTransaction<ActivateUserData, void>({
    db,
    useCase: new ActivateUser({
      logger: logger.withContext({ useCase: ActivateUser.name }),
      userRepo: createUserRepository({ logger }),
      userActivationRepo: createUserActivationRepository({ logger }),
      timeProvider: new TimeProvider(),
    }),
  });

  return new ActivateUserHandler({
    useCase: activateUser,
    logger: logger.withContext({ handler: ActivateUserHandler.name }),
  });
};

export const authenticateHandlerFactory: HandlerFactory<AuthenticateHandler> = (
  req,
) => {
  const logger = req.logger;

  const useCase = new UseCaseWithTransaction<CreateUserData, User>({
    db,
    useCase: new Authenticate({
      logger: logger.withContext({ useCase: Authenticate.name }),
      userRepo: createUserRepository({ logger }),
      passwordHashVerifier: new PasswordManager(),
    }),
  });

  return new AuthenticateHandler({
    useCase,
    logger: logger.withContext({ handler: AuthenticateHandler.name }),
  });
};
