import { Request } from 'express';
import { HttpError } from '../shared/httpErrors';
import { Handler, HandlerFactory } from '../shared/handler';
import { ILogger } from '../../logger';
import { IAuthTokenVerifier } from '../core/auth';
import { JwtTokenProvider } from '../shared/jwtTokenProvider';

type AuthorizationMiddlewareDependencies = {
  logger: ILogger;
  tokenVerifier: IAuthTokenVerifier;
};

export class AuthorizationMiddleware extends Handler {
  private logger: ILogger;
  private tokenVerifier: IAuthTokenVerifier;

  constructor({ logger, tokenVerifier }: AuthorizationMiddlewareDependencies) {
    super();

    this.logger = logger;
    this.tokenVerifier = tokenVerifier;
  }

  protected async _handle(req: Request) {
    this.logger.info('Authorizing user');

    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return this.fail(HttpError.unauthorized('invalid token'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer') {
      return this.fail(HttpError.unauthorized('invalid token'));
    }

    const result = await this.tokenVerifier.verifyToken(token);

    if (!result.isSuccess) {
      return this.fail(HttpError.unauthorized(result.error));
    }

    req.getAuthorizedUser = () => {
      if (!result.authorizedUser) {
        throw new Error(
          'getAuthorizedUser() tries to operate on empty authorizedUser object! This should not happen',
        );
      }

      return result.authorizedUser;
    };

    return this.next();
  }
}

export const authorizationMiddlewareFactory: HandlerFactory<AuthorizationMiddleware> = (
  req,
) => {
  const logger = req.logger;

  return new AuthorizationMiddleware({
    logger: logger.withContext({ handler: AuthorizationMiddleware.name }),
    tokenVerifier: new JwtTokenProvider(),
  });
};
