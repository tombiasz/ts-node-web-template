import { DbSession } from '../../dbSession';
import { Logger } from '../../logger';
import { User } from './user';
import { UserRepository } from './userRepository';
import { UseCase } from '../core/useCase';

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
    const { id, username, password } = data;

    // TODO: unique username
    const user = new User({
      id, // TODO: generate id
      username,
      password, // TODO: password hashing
    });

    this.userRepo.save(user);
    this.db.save();

    this.logger.info('new user created', { id: user.id });

    return user;
  }
}
