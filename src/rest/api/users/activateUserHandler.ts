import { Request } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler } from '../../shared/handler';
import { UserAlreadyActivatedError } from '@app/userAccess/domain/user';
import {
  TokenAlreadyUsedError,
  TokenNotFoundError,
} from '@app/userAccess/domain/userActivation';
import { ActivateUserData } from '@app/userAccess/useCases';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';

type ActivateUserHandlerDependencies = {
  useCase: UseCase<ActivateUserData, void>;
  logger: ILogger;
};

export class ActivateUserHandler extends Handler {
  private useCase: UseCase<ActivateUserData, void>;
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
        error instanceof TokenAlreadyUsedError ||
        error instanceof UserAlreadyActivatedError ||
        error instanceof TokenNotFoundError
      ) {
        return this.fail(HttpError.badRequest(error.message));
      }

      throw error;
    }
  }
}
