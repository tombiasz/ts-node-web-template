import { ILogger } from '../../logger';
import { DbSession } from '@database/core';
import { DomainError, ITimeProvider } from '@domain/core';
import { User, IUserRepository } from '@domain/user';
import {
  IUserActivationRepository,
  UserActivation,
} from '@domain/userActivation';
import { UseCase } from '../core';
// TODO: central error definiton
import { UsernameNotUniqueError } from './createUser';

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
    // - User.active
    const user = User.register({
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
