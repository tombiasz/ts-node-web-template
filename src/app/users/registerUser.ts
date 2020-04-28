import { ILogger } from '../../logger';
import { DbSession } from '@database/core';
import { DomainError, ITimeProvider } from '@domain/core';
import { User, IUserRepository } from '@domain/user';
import {
  IUserActivationRepository,
  UserActivation,
} from '@domain/userActivation';
import { UseCase } from '../core';

type RegisterUserProps = {
  db: DbSession;
  userRepo: IUserRepository;
  userActivationRepo: IUserActivationRepository;
  timeProvider: ITimeProvider;
  logger: ILogger;
};

type RegisterUserData = {
  id: string;
  username: string;
  password: string;
};

// TODO: duplicate error name
export class UsernameNotUniqueError extends DomainError {
  message = 'username already taken';
}

export class RegisterUser extends UseCase<RegisterUserData, User> {
  private db: DbSession;
  private userRepo: IUserRepository;
  private userActivationRepo: IUserActivationRepository;
  private timeProvider: ITimeProvider;
  private logger: ILogger;

  constructor(props: RegisterUserProps) {
    super();

    this.db = props.db;
    this.userRepo = props.userRepo;
    this.userActivationRepo = props.userActivationRepo;
    this.timeProvider = props.timeProvider;
    this.logger = props.logger;
  }

  public async execute(data: RegisterUserData) {
    this.logger.info('Registering new user');

    const { username, password } = data;

    const usernameExist = await this.userRepo.isUsernameExist(username);

    if (usernameExist) {
      throw new UsernameNotUniqueError();
    }

    // TODO:
    // - User.register
    // - User.active
    const user = User.create({
      username,
      password, // TODO: password hashing
    });

    const userActivation = UserActivation.createForUser(
      user.id,
      this.timeProvider,
    );

    this.userRepo.save(user);
    this.userActivationRepo.save(userActivation);

    this.db.save();

    this.logger.info('new user created', { id: user.id });

    return user;
  }
}
