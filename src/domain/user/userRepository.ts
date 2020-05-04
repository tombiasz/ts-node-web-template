import { User } from './user';
import { UserId } from './userId';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: UserId): Promise<User>;
  save(user: User): Promise<void>;
  delete(user: User): Promise<void>;
  isUsernameExist(username: string): Promise<boolean>;
}
