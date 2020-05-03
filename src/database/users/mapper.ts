import { User, UserId } from '@domain/user';
import { UserModel } from './model';

const toDb = (user: User): UserModel => ({
  id: user.id.value,
  username: user.username,
  password: user.password,
  createdAt: user.createdAt,
  isActive: user.isActive,
});

const toEntity = (dto: UserModel): User =>
  new User({
    id: new UserId(dto.id),
    username: dto.username,
    password: dto.password,
    createdAt: dto.createdAt,
    isActive: dto.isActive,
  });

export const UserMapper = {
  toDb,
  toEntity,
};
