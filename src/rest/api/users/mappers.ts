import { User } from '../../../domain/user/user';

type UserModel = {
  id: string;
  username: string;
  password: string;
};

const toDb = (user: User): UserModel => ({
  id: user.id,
  username: user.username,
  password: user.password,
});

const toEntity = (dto: UserModel): User =>
  new User({
    id: dto.id,
    username: dto.username,
    password: dto.password,
  });

export const UserMapper = {
  toDb,
  toEntity,
};
