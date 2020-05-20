import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { AuthenticateData } from '@app/users';
import {
  User,
  InvalidUsernameOrPassword,
  UserNotActivated,
} from '@domain/user';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';

type AuthenticateHandlerDependencies = {
  useCase: UseCase<AuthenticateData, User>;
  logger: ILogger;
};

export class AuthenticateHandler extends Handler {
  private useCase: UseCase<AuthenticateData, User>;

  private logger: ILogger;

  constructor({ useCase, logger }: AuthenticateHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const user = await this.useCase.execute(req.body);

      this.logger.info('user authenticated', { id: user.id.value });

      return this.ok(UserSerializer.one(user));
    } catch (error) {
      if (
        error instanceof InvalidUsernameOrPassword ||
        error instanceof UserNotActivated
      ) {
        return this.fail(HttpError.unauthorized(error.message));
      }

      throw error;
    }
  }
}
