import { UserRepository } from '../../../domain/user/userRepository';
import { User } from '../../../domain/user/user';
import { UserMapper } from './mappers';
import { DbSession } from '../../../dbSession';
import { Logger } from '../../../logger';

const USERS_KEY = '/users';

type RepositoryProps = {
  db: DbSession;
  logger: Logger;
};

export class UserJsonDBRepository implements UserRepository {
  private db: DbSession;
  private logger: Logger;

  constructor({ db, logger }: RepositoryProps) {
    this.db = db;
    this.logger = logger;
  }

  getAll(): User[] {
    const records = this.db.getData(USERS_KEY);
    return [];
  }

  getById(id: string): User {
    this.logger.debug(`Getting user by id ${id}`);

    const data = this.db.getData(this.createKey(id));

    return UserMapper.toEntity(data);
  }

  save(user: User): void {
    this.logger.debug(`Saving new user`);

    const data = UserMapper.toDb(user);

    this.db.push(this.createKey(data.id), data);
  }

  delete(user: User): void {}

  private createKey(...bits: string[]) {
    return [USERS_KEY, ...bits].join('/');
  }
}
