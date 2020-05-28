import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { RegisterUserData } from '@app/userAccess/useCases';
import { UsernameNotUniqueError, User } from '@app/userAccess/domain/user';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';

type RegisterUserHandlerDependencies = {
  useCase: UseCase<RegisterUserData, User>;
  logger: ILogger;
};

export class RegisterUserHandler extends Handler {
  private useCase: UseCase<RegisterUserData, User>;

  private logger: ILogger;

  constructor({ useCase, logger }: RegisterUserHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const user = await this.useCase.execute(req.body);

      this.logger.info('new user registered', { id: user.id });

      return this.ok(UserSerializer.one(user));
    } catch (error) {
      if (error instanceof UsernameNotUniqueError) {
        return this.fail(HttpError.conflict(error.message));
      }

      throw error;
    }
  }
}
