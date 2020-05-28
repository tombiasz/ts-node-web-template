import { ILogger } from '../../../logger';
import { ITimeProvider, IPasswordHashCalculator } from '@app/userAccess/core';
import {
  User,
  IUserRepository,
  UsernameNotUniqueError,
} from '@app/userAccess/domain/user';
import { UseCase } from '@app/core';

export type CreateUserProps = {
  userRepo: IUserRepository;
  logger: ILogger;
  timeProvider: ITimeProvider;
  passwordHashCalculator: IPasswordHashCalculator;
};

export type CreateUserData = {
  id: string;
  username: string;
  password: string;
};

export class CreateUser extends UseCase<CreateUserData, User> {
  private userRepo: IUserRepository;
  private logger: ILogger;
  private timeProvider: ITimeProvider;
  private passwordHashCalculator: IPasswordHashCalculator;

  constructor(props: CreateUserProps) {
    super();

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
        password: await this.passwordHashCalculator.hashPassword(password),
      },
      this.timeProvider,
    );

    await this.userRepo.save(user);

    this.logger.info('new user created', { id: user.id });

    return user;
  }
}
