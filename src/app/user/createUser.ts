import { DbSession } from '../../database/dbSession';
import { ILogger } from '../../logger';
import { User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/userRepository';
import { UseCase } from '../../domain/core/useCase';
import { DomainError } from '../../domain/core/domainError';

type CreateUserProps = {
  db: DbSession;
  userRepo: IUserRepository;
  logger: ILogger;
};

type CreateUserData = {
  id: string;
  username: string;
  password: string;
};

export class UsernameNotUniqueError extends DomainError {
  message = 'username already taken';
}

export class CreateUser extends UseCase<CreateUserData, User> {
  private db: DbSession;
  private userRepo: IUserRepository;
  private logger: ILogger;

  constructor(props: CreateUserProps) {
    super();

    this.db = props.db;
    this.userRepo = props.userRepo;
    this.logger = props.logger;
  }

  public async execute(data: CreateUserData) {
    this.logger.info('Creating new user');

    const { username, password } = data;

    const usernameExist = await this.userRepo.isUsernameExist(username);

    if (usernameExist) {
      throw new UsernameNotUniqueError();
    }

    const user = User.create({
      username,
      password, // TODO: password hashing
    });

    this.userRepo.save(user);

    this.db.save();

    this.logger.info('new user created', { id: user.id });

    return user;
  }
}
