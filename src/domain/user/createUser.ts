import { DbSession } from '../../dbSession';
import { Logger } from '../../logger';
import { User } from './user';
import { UserRepository } from './userRepository';

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

export class CreateUser {
  private db: DbSession;
  private userRepo: UserRepository;
  private logger: Logger;

  constructor(props: CreateUserProps) {
    this.db = props.db;
    this.userRepo = props.userRepo;
    // TODO: set logger context
    this.logger = props.logger;
  }

  // TODO: UseCase/Interactor interface
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
