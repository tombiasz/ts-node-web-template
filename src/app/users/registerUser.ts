import { ILogger } from '../../logger';
import { DbSession } from '@database/core';
import { ITimeProvider, IPasswordHashCalculator } from '@domain/core';
import { User, IUserRepository, UsernameNotUniqueError } from '@domain/user';
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
  passwordHashCalculator: IPasswordHashCalculator;
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
  private passwordHashCalculator: IPasswordHashCalculator;

  constructor(props: RegisterUserProps) {
    super();

    this.db = props.db;
    this.userRepo = props.userRepo;
    this.userActivationRepo = props.userActivationRepo;
    this.timeProvider = props.timeProvider;
    this.logger = props.logger;
    this.passwordHashCalculator = props.passwordHashCalculator;
  }

  public async execute(data: RegisterUserData) {
    this.logger.info('Registering new user');

    const { username, password } = data;

    const usernameExist = await this.userRepo.isUsernameExist(username);

    if (usernameExist) {
      throw new UsernameNotUniqueError();
    }

    const user = User.register(
      {
        username,
        password: this.passwordHashCalculator.hashPassword(password),
      },
      this.timeProvider,
    );

    const userActivation = UserActivation.createForUser(
      user.id,
      this.timeProvider,
    );

    await this.userRepo.save(user);
    await this.userActivationRepo.save(userActivation);

    this.db.save();

    this.logger.info('new user created', { id: user.id });

    return user;
  }
}
