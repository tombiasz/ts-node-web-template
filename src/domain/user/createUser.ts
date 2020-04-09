import { DbSession } from '../../dbSession';
import { Logger } from '../../logger';
import { User } from './user';
import { UserRepository } from './userRepository';
import { UseCase } from '../core/useCase';
import { DomainError } from '../core/domainError';

type CreateUserProps = {
  db: DbSession;
  userRepo: UserRepository;
  logger: Logger;
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
  private userRepo: UserRepository;
  private logger: Logger;

  constructor(props: CreateUserProps) {
    super();

    this.db = props.db;
    this.userRepo = props.userRepo;
    this.logger = UseCase.extendLoggerWithContext(props.logger);
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
