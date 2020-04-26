import { UserActivation } from './userActivation';
import { UserId } from '../user/userId';

export interface IUserActivationRepository {
  getByUserId(id: UserId): UserActivation;
  save(userActivation: UserActivation): void;
}
