import { UserId } from '@app/userAccess/domain/user';
import {
  UserActivation,
  ActivationToken,
} from '@app/userAccess/domain/userActivation';
import { UserActivationModel } from './model';

const toDb = (entity: UserActivation): UserActivationModel => ({
  userId: entity.userId.value,
  token: entity.token.value,
  createdAt: entity.createdAt,
  usedOn: entity.usedOn,
});

const toEntity = (dto: UserActivationModel): UserActivation =>
  new UserActivation({
    userId: new UserId(dto.userId),
    token: new ActivationToken(dto.token),
    createdAt: dto.createdAt,
    usedOn: dto.usedOn,
  });

export const UserActivationMapper = {
  toDb,
  toEntity,
};
