import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { CreateUser } from '@app/users';
import { UsernameNotUniqueError } from '@domain/user';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';

type CreateUserHandlerDependencies = {
  useCase: CreateUser;
  logger: ILogger;
};

export class CreateUserHandler extends Handler {
  private useCase: CreateUser;

  private logger: ILogger;

  constructor({ useCase, logger }: CreateUserHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const user = await this.useCase.execute(req.body);

      this.logger.info('new user created', { id: user.id });

      return this.ok(UserSerializer.one(user));
    } catch (error) {
      if (error instanceof UsernameNotUniqueError) {
        return this.fail(HttpError.conflict(error.message));
      }

      throw error;
    }
  }
}
