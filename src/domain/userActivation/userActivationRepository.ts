import { UserId } from '../user/userId';
import { UserActivation } from './userActivation';
import { ActivationToken } from './activationToken';

export interface IUserActivationRepository {
  getByUserId(id: UserId): Promise<UserActivation | null>;
  getByToken(token: ActivationToken): Promise<UserActivation | null>;
  save(userActivation: UserActivation): Promise<void>;
}
