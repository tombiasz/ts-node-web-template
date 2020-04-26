import { Request } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { GetUser, UserNotFoundError } from '../../../domain/user/getUser';
import { ILogger } from '../../../logger';

type GetUserHandlerDependencies = {
  useCase: GetUser;
  logger: ILogger;
};

export class GetUserHandler extends Handler {
  private useCase: GetUser;

  private logger: ILogger;

  constructor({ useCase, logger }: GetUserHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    this.logger.info('Getting user');

    try {
      const result = await this.useCase.execute({
        id: req.params.id,
      });

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
