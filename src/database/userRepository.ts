import { JsonDB } from 'node-json-db';
import { UserRepository } from '../domain/user/userRepository';
import { User } from '../domain/user/user';
import { UserMapper } from './mappers/users';

const USERS_KEY = '/users';

type RepositoryProps = {
  db: JsonDB;
};

export class UserJsonDBRepository implements UserRepository {
  private db: JsonDB;

  constructor({ db }: RepositoryProps) {
    this.db = db;
  }

  getAll(): User[] {
    const records = this.db.getData(USERS_KEY);
    return [];
  }

  getById(id: string): User {
    const data = this.db.getData(this.createKey(id));
    return UserMapper.toEntity(data);
  }

  save(user: User): void {
    const data = UserMapper.toDb(user);
    this.db.push(this.createKey(data.id), data);
  }

  delete(user: User): void {}

  private createKey(...bits: string[]) {
    return [USERS_KEY, ...bits].join('/');
  }
}
