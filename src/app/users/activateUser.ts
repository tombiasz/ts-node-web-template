import { ILogger } from '../../logger';
import { DbSession } from '@database/core';
import { DomainError, ITimeProvider } from '@domain/core';
import { User, IUserRepository } from '@domain/user';
import {
  IUserActivationRepository,
  UserActivation,
  ActivationToken,
} from '@domain/userActivation';
import { UseCase } from '../core';

// TODO: central error definition
export class TokenDoesNotExistError extends DomainError {
  message = 'token does not exist';
}

export class UserAlreadyActivatedError extends DomainError {
  message = 'user was already activated';
}

type ActivateUserProps = {
  db: DbSession;
  userRepo: IUserRepository;
  userActivationRepo: IUserActivationRepository;
  timeProvider: ITimeProvider;
  logger: ILogger;
};

type ActivateUserData = {
  token: string;
};

export class ActivateUser extends UseCase<ActivateUserData, void> {
  private db: DbSession;
  private userRepo: IUserRepository;
  private userActivationRepo: IUserActivationRepository;
  private timeProvider: ITimeProvider;
  private logger: ILogger;

  constructor(props: ActivateUserProps) {
    super();

    this.db = props.db;
    this.userRepo = props.userRepo;
    this.userActivationRepo = props.userActivationRepo;
    this.timeProvider = props.timeProvider;
    this.logger = props.logger;
  }

  public async execute({ token }: ActivateUserData) {
    this.logger.info('Activating user');

    const userActivation = await this.userActivationRepo.getByToken(
      new ActivationToken(token),
    );

    if (!userActivation) {
      throw new TokenDoesNotExistError();
    }

    const user = await this.userRepo.getById(userActivation.userId);

    if (user.isActive) {
      throw new UserAlreadyActivatedError();
    }

    userActivation.markAsUsed(this.timeProvider);
    user.activate();

    await this.userRepo.save(user);
    await this.userActivationRepo.save(userActivation);

    this.db.save();

    this.logger.info('User activated', { id: user.id });
  }
}
