import { Request } from 'express';
import { HttpError } from '../shared/httpErrors';
import { Handler, HandlerFactory } from '../shared/handler';
import { ILogger } from '../../logger';
import { UserRole } from '@app/userAccess/domain/user';

type CheckRoleMiddlewareDependencies = {
  logger: ILogger;
  requiredRoleName: UserRole;
};

export class CheckRoleMiddleware extends Handler {
  private logger: ILogger;
  private requiredRoleName: UserRole;

  constructor({ logger, requiredRoleName }: CheckRoleMiddlewareDependencies) {
    super();

    this.logger = logger;
    this.requiredRoleName = requiredRoleName;
  }

  protected async _handle(req: Request) {
    const authUser = req.getAuthorizedUser();

    this.logger.info(
      `Checking user ${authUser.userId} permission for role ${this.requiredRoleName}`,
    );

    if (authUser.role !== this.requiredRoleName) {
      return this.fail(HttpError.unauthorized('invalid user role'));
    }

    return this.next();
  }
}

export const checkRoleMiddlewareFactory: (
  requiredRoleName: UserRole,
) => HandlerFactory<CheckRoleMiddleware> = (requiredRoleName: UserRole) => {
  return (req: Request) => {
    const logger = req.logger;

    return new CheckRoleMiddleware({
      logger: logger.withContext({ handler: CheckRoleMiddleware.name }),
      requiredRoleName,
    });
  };
};

export const checkSellerUserRoleFactory: HandlerFactory<CheckRoleMiddleware> = checkRoleMiddlewareFactory(
  UserRole.SELLER,
);

export const checkAdminUserRoleFactory: HandlerFactory<CheckRoleMiddleware> = checkRoleMiddlewareFactory(
  UserRole.ADMIN,
);
