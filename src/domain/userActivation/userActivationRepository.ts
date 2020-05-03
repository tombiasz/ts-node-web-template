import { UserId } from '../user/userId';
import { UserActivation } from './userActivation';

export interface IUserActivationRepository {
  getByUserId(id: UserId): Promise<UserActivation | null>;
  save(userActivation: UserActivation): Promise<void>;
}
