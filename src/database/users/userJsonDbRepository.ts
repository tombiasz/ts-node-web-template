import { ILogger } from '../../logger';
import { User, UserId, IUserRepository, UserNotFoundError } from '@domain/user';
import { DbSession, db } from '../core/dbSession';
import { UserMapper } from './mapper';
import { UserModel } from './model';

const USERS_KEY = '/users';

type RepositoryProps = {
  db: DbSession;
  logger: ILogger;
};

export class UserJsonDbRepository implements IUserRepository {
  private db: DbSession;
  private logger: ILogger;

  constructor({ db, logger }: RepositoryProps) {
    this.db = db;
    this.logger = logger;
  }

  async getAll(): Promise<User[]> {
    const records = this.db.getData(USERS_KEY);
    return [];
  }

  async getById(id: UserId): Promise<User> {
    this.logger.debug(`Getting user by id ${id}`);

    try {
      const data = this.db.getData(this.createKey(id.value));

      return UserMapper.toEntity(data);
    } catch (error) {
      this.logger.warn(`Error when getting user by id ${id}`, { error });

      throw new UserNotFoundError();
    }
  }

  async save(user: User): Promise<void> {
    this.logger.debug(`Saving new user`);

    const data = UserMapper.toDb(user);

    this.db.push(this.createKey(data.id), data);
  }

  async delete(user: User): Promise<void> {}

  async isUsernameExist(username: string): Promise<boolean> {
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

export const createUserRepository = ({ logger }: { logger: ILogger }) =>
  new UserJsonDbRepository({
    db,
    logger: logger.withContext({ repo: UserJsonDbRepository.name }),
  });
