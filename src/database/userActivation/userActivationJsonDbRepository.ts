import { ILogger } from '../../logger';
import {
  IUserActivationRepository,
  UserActivation,
  ActivationToken,
  TokenNotFoundError,
} from '@app/userAccess/domain/userActivation';
import { DbSession, db } from '../core/dbSession';
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

  async getByToken(token: ActivationToken): Promise<UserActivation> {
    const found = this.db.find<UserActivationModel>(
      this.createKey(),
      (record) => record.token === token.value,
    );

    if (!found) {
      throw new TokenNotFoundError();
    }

    return UserActivationMapper.toEntity(found);
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

export const createUserActivationRepository = ({
  logger,
}: {
  logger: ILogger;
}) =>
  new UserActivationJsonDbRepository({
    logger: logger.withContext({ repo: UserActivationJsonDbRepository.name }),
    db,
  });
