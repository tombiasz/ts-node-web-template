import { IUserRepository } from '../../domain/user/userRepository';
import { User } from '../../domain/user/user';
import { UserMapper } from './mappers';
import { DbSession } from '../dbSession';
import { ILogger } from '../../logger';
import { UserId } from '../../domain/user/userId';

const USERS_KEY = '/users';

type RepositoryProps = {
  db: DbSession;
  logger: ILogger;
};

export type UserModel = {
  id: string;
  username: string;
  password: string;
};

export class UserJsonDBRepository implements IUserRepository {
  private db: DbSession;
  private logger: ILogger;

  constructor({ db, logger }: RepositoryProps) {
    this.db = db;
    this.logger = logger;
  }

  getAll(): User[] {
    const records = this.db.getData(USERS_KEY);
    return [];
  }

  getById(id: UserId): User {
    this.logger.debug(`Getting user by id ${id}`);

    const data = this.db.getData(this.createKey(id.value));

    return UserMapper.toEntity(data);
  }

  save(user: User): void {
    this.logger.debug(`Saving new user`);

    const data = UserMapper.toDb(user);

    this.db.push(this.createKey(data.id), data);
  }

  delete(user: User): void {}

  isUsernameExist(username: string): boolean {
    const found = this.db.filter<UserModel>(
      this.createKey(),
      (user) => user.username === username,
    );

    return found ? found.length > 0 : false;
  }

  private createKey(...bits: string[]) {
    return [USERS_KEY, ...bits].join('/');
  }
}
