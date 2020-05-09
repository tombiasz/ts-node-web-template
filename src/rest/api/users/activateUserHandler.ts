import { Request } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import {
  ActivateUser,
  UserAlreadyActivatedError,
  TokenDoesNotExistError,
} from '@app/users';
import { ILogger } from '../../../logger';

type ActivateUserHandlerDependencies = {
  useCase: ActivateUser;
  logger: ILogger;
};

export class ActivateUserHandler extends Handler {
  private useCase: ActivateUser;
  private logger: ILogger;

  constructor({ useCase, logger }: ActivateUserHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    this.logger.info('Activating user');

    try {
      await this.useCase.execute({ token: req.params.token });

      return this.ok();
    } catch (error) {
      this.logger.error('Error during user activation', { error });

      if (
        error instanceof TokenDoesNotExistError ||
        error instanceof UserAlreadyActivatedError
      ) {
        return this.fail(HttpError.badRequest(error.message));
      }

      throw error;
    }
  }
}