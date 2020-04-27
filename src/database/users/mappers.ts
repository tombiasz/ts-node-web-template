import { User } from '../../domain/user/user';
import { UserId } from '../../domain/user/userId';
import { UserModel } from './userRepository';

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
