import { Request } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import {
  UserNotFoundError,
  IUserRepository,
  UserId,
} from '@app/userAccess/domain/user';
import { ILogger } from '../../../logger';

type GetUserHandlerDependencies = {
  userRepo: IUserRepository;
  logger: ILogger;
};

export class GetUserHandler extends Handler {
  private userRepo: IUserRepository;

  private logger: ILogger;

  constructor({ userRepo, logger }: GetUserHandlerDependencies) {
    super();

    this.userRepo = userRepo;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    this.logger.info('Getting user');

    try {
      const result = await this.userRepo.getById(new UserId(req.params.id));

      return this.ok(UserSerializer.one(result));
    } catch (error) {
      this.logger.error('Error during getting user', { error });

      if (error instanceof UserNotFoundError) {
        return this.fail(HttpError.notFound(error.message));
      }

      throw error;
    }
  }
}
