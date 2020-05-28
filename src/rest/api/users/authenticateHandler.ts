import { Request } from 'express';
import { Handler } from '../../shared/handler';
import {
  AuthenticateData,
  AuthenticationResult,
} from '@app/userAccess/useCases';
import {
  InvalidUsernameOrPassword,
  UserNotActivated,
} from '@app/userAccess/domain/user';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';
import { IAuthTokenCalculator } from 'src/rest/core/auth';

type AuthenticateHandlerDependencies = {
  useCase: UseCase<AuthenticateData, AuthenticationResult>;
  logger: ILogger;
  tokenCalculator: IAuthTokenCalculator;
};

export class AuthenticateHandler extends Handler {
  private useCase: UseCase<AuthenticateData, AuthenticationResult>;
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
      const auth = await this.useCase.execute(req.body);

      this.logger.info('user authenticated', { id: auth.userId });

      const token = await this.tokenCalculator.generateToken(auth);

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
