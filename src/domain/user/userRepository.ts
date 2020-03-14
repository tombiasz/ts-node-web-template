import { User } from './user';

export interface UserRepository {
  getAll(): User[];
  getById(id: string): User;
  save(user: User): void;
  delete(user: User): void;
}
