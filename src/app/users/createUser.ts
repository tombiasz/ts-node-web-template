import { ILogger } from '../../logger';
import { DbSession } from '@database/core';
import { ITimeProvider, IPasswordHashCalculator } from '@domain/core';
import { User, IUserRepository } from '@domain/user';
import { UseCase } from '../core';
import { UsernameNotUniqueError } from './errors';

type CreateUserProps = {
  db: DbSession;
  userRepo: IUserRepository;
  logger: ILogger;
  timeProvider: ITimeProvider;
  passwordHashCalculator: IPasswordHashCalculator;
};

type CreateUserData = {
  id: string;
  username: string;
  password: string;
};

export class CreateUser extends UseCase<CreateUserData, User> {
  private db: DbSession;
  private userRepo: IUserRepository;
  private logger: ILogger;
  private timeProvider: ITimeProvider;
  private passwordHashCalculator: IPasswordHashCalculator;

  constructor(props: CreateUserProps) {
    super();

    this.db = props.db;
    this.userRepo = props.userRepo;
    this.logger = props.logger;
    this.timeProvider = props.timeProvider;
    this.passwordHashCalculator = props.passwordHashCalculator;
  }

  public async execute(data: CreateUserData) {
    this.logger.info('Creating new user');

    const { username, password } = data;

    const usernameExist = await this.userRepo.isUsernameExist(username);

    if (usernameExist) {
      throw new UsernameNotUniqueError();
    }

    const user = User.create(
      {
        username,
        password: this.passwordHashCalculator.hashPassword(password),
      },
      this.timeProvider,
    );

    await this.userRepo.save(user);
    this.db.save();

    this.logger.info('new user created', { id: user.id });

    return user;
  }
}
