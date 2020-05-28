import { ILogger } from '../../../logger';
import { ITimeProvider, IPasswordHashCalculator } from '@app/userAccess/core';
import {
  User,
  IUserRepository,
  UsernameNotUniqueError,
} from '@app/userAccess/domain/user';
import {
  IUserActivationRepository,
  UserActivation,
} from '@app/userAccess/domain/userActivation';
import { UseCase } from '@app/core';

export type RegisterUserProps = {
  userRepo: IUserRepository;
  userActivationRepo: IUserActivationRepository;
  timeProvider: ITimeProvider;
  logger: ILogger;
  passwordHashCalculator: IPasswordHashCalculator;
};

export type RegisterUserData = {
  id: string;
  username: string;
  password: string;
};

export class RegisterUser extends UseCase<RegisterUserData, User> {
  private userRepo: IUserRepository;
  private userActivationRepo: IUserActivationRepository;
  private timeProvider: ITimeProvider;
  private logger: ILogger;
  private passwordHashCalculator: IPasswordHashCalculator;

  constructor(props: RegisterUserProps) {
    super();

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
        password: await this.passwordHashCalculator.hashPassword(password),
      },
      this.timeProvider,
    );

    const userActivation = UserActivation.createForUser(
      user.id,
      this.timeProvider,
    );

    await this.userRepo.save(user);
    await this.userActivationRepo.save(userActivation);

    this.logger.info('new user created', { id: user.id });

    return user;
  }
}
