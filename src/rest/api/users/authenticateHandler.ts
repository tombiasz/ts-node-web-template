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
import { IAuthTokenCalculator } from 'src/rest/shared/auth';

type AuthenticateHandlerDependencies = {
  useCase: UseCase<AuthenticateData, User>;
  logger: ILogger;
  tokenCalculator: IAuthTokenCalculator;
};

export class AuthenticateHandler extends Handler {
  private useCase: UseCase<AuthenticateData, User>;
  private logger: ILogger;
  private tokenCalculator: IAuthTokenCalculator;

  constructor({
    useCase,
    logger,
    tokenCalculator,
  }: AuthenticateHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
    this.tokenCalculator = tokenCalculator;
  }

  protected async _handle(req: Request) {
    try {
      const user = await this.useCase.execute(req.body);

      this.logger.info('user authenticated', { id: user.id.value });

      const token = await this.tokenCalculator.generateToken(user);

      return this.ok({ token });
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
