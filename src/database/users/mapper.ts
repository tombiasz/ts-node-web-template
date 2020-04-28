import { User, UserId } from '@domain/user';
import { UserModel } from './model';

const toDb = (user: User): UserModel => ({
  id: user.id.value,
  username: user.username,
  password: user.password,
});

const toEntity = (dto: UserModel): User =>
  new User({
    id: new UserId(dto.id),
    username: dto.username,
    password: dto.password,
  });

export const UserMapper = {
  toDb,
  toEntity,
};
