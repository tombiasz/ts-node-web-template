import { UserId } from '../user/userId';
import { UserActivation } from './userActivation';

export interface IUserActivationRepository {
  getByUserId(id: UserId): UserActivation;
  save(userActivation: UserActivation): void;
}
