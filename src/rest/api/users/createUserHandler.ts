import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { CreateUserData } from '@app/userAccess/useCases';
import { UsernameNotUniqueError, User } from '@app/userAccess/domain/user';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';

type CreateUserHandlerDependencies = {
  useCase: UseCase<CreateUserData, User>;
  logger: ILogger;
};

export class CreateUserHandler extends Handler {
  private useCase: UseCase<CreateUserData, User>;

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
