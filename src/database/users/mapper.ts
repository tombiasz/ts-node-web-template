import { User, UserId, UserRole } from '@app/userAccess/domain/user';
import { UserModel } from './model';

const toDb = (user: User): UserModel => ({
  id: user.id.value,
  username: user.username,
  password: user.password,
  createdAt: user.createdAt,
  isActive: user.isActive,
  role: user.role,
});

const toEntity = (dto: UserModel): User =>
  new User({
    id: new UserId(dto.id),
    username: dto.username,
    password: dto.password,
    createdAt: dto.createdAt,
    isActive: dto.isActive,
    role: UserRole[dto.role as keyof typeof UserRole],
  });

export const UserMapper = {
  toDb,
  toEntity,
};
