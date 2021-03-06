import { UserId } from '../user/userId';
import { UserActivation } from './userActivation';
import { ActivationToken } from './activationToken';

export interface IUserActivationRepository {
  getByToken(token: ActivationToken): Promise<UserActivation>;
  save(userActivation: UserActivation): Promise<void>;
}
