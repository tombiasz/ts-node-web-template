import { JsonDB } from 'node-json-db';
import { UserRepository } from '../domain/user/userRepository';
import { User } from '../domain/user/user';

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
    // TODO: db to User mapper
    return this.db.getData(this.createKey(id));
  }

  save(user: User): void {
    // TODO: User to db mapper
    this.db.push(this.createKey(user.id), user);
  }

  delete(user: User): void {}

  private createKey(...bits: string[]) {
    return [USERS_KEY, ...bits].join('/');
  }
}
