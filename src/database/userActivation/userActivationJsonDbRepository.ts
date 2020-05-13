import { ILogger } from '../../logger';
import {
  IUserActivationRepository,
  UserActivation,
  ActivationToken,
} from '@domain/userActivation';
import { UserId } from '@domain/user';
import { DbSession } from '../core/dbSession';
import { UserActivationMapper } from './mapper';
import { UserActivationModel } from './model';

const USER_ACTIVATIONS_KEY = '/userActivations';

type RepositoryProps = {
  db: DbSession;
  logger: ILogger;
};

export class UserActivationJsonDbRepository
  implements IUserActivationRepository {
  private db: DbSession;
  private logger: ILogger;

  constructor({ db, logger }: RepositoryProps) {
    this.db = db;
    this.logger = logger;
  }

  async getByToken(token: ActivationToken): Promise<UserActivation | null> {
    const found = this.db.find<UserActivationModel>(
      this.createKey(),
      (record) => record.token === token.value,
    );

    return found ? UserActivationMapper.toEntity(found) : null;
  }

  async save(userActivation: UserActivation): Promise<void> {
    this.logger.debug(`Saving new user activation`);

    const data = UserActivationMapper.toDb(userActivation);

    this.db.push(this.createKey(data.userId), data);
  }

  private createKey(...bits: string[]) {
    return [USER_ACTIVATIONS_KEY, ...bits].join('/');
  }
}
