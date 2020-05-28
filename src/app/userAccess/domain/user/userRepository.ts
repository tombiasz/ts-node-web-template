import { User } from './user';
import { UserId } from './userId';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: UserId): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(user: User): Promise<void>;
  isUsernameExist(username: string): Promise<boolean>;
}
