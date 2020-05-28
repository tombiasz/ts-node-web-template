import { ILogger } from '../../../logger';
import { IPasswordHashVerifier } from '@app/userAccess/core';
import {
  IUserRepository,
  UserNotActivated,
  InvalidUsernameOrPassword,
} from '@app/userAccess/domain/user';
import { UseCase } from '@app/core';

export type AuthenticateDependencies = {
  userRepo: IUserRepository;
  logger: ILogger;
  passwordHashVerifier: IPasswordHashVerifier;
};

export type AuthenticateData = {
  username: string;
  password: string;
};

export type AuthenticationResult = {
  userId: string;
  username: string;
};

export class Authenticate extends UseCase<
  AuthenticateData,
  AuthenticationResult
> {
  private userRepo: IUserRepository;
  private logger: ILogger;
  private passwordHashVerifier: IPasswordHashVerifier;

  constructor(props: AuthenticateDependencies) {
    super();

    this.userRepo = props.userRepo;
    this.logger = props.logger;
    this.passwordHashVerifier = props.passwordHashVerifier;
  }

  public async execute({ username, password }: AuthenticateData) {
    this.logger.info('Authenticate user');

    const user = await this.userRepo.findByUsername(username);

    if (!user) {
      throw new InvalidUsernameOrPassword();
    }

    const passwordVerified = await this.passwordHashVerifier.verifyHashedPassword(
      user.password,
      password,
    );
    if (!passwordVerified) {
      throw new InvalidUsernameOrPassword();
    }

    if (!user.isActive) {
      throw new UserNotActivated();
    }

    this.logger.info('User authenticated', { id: user.id.value });

    return {
      userId: user.id.value,
      username: user.username,
    };
  }
}
