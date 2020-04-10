import { User } from './user';
import { UserId } from './userId';

export interface UserRepository {
  getAll(): User[];
  getById(id: UserId): User;
  save(user: User): void;
  delete(user: User): void;
  isUsernameExist(username: string): boolean;
}
