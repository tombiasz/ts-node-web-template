import { Router } from 'express';
import { asHandler, asMiddleware } from '../shared/handler';
import {
  createCreateUserValidator,
  createGetUserValidator,
  createActivateUserValidator,
  createAuthenticateValidator,
} from './users/validators';
import {
  getUserHandlerFactory,
  createUserHandlerFactory,
  registerUserHandlerFactory,
  activateUserHandlerFactory,
  authenticateHandlerFactory,
} from './users/factories';
import { authorizationMiddlewareFactory } from './authorizationMiddleware';
import { checkSellerUserRoleFactory } from './checkRoleMiddleware';
import { registerAuctionHandlerFactory } from './auctions/factories';
import { UserRole } from '@app/userAccess/domain/user';

export function createApiRoutes(): Router | Router[] {
  return [
    Router().post(
      '/auth',
      createAuthenticateValidator(),
      asHandler(authenticateHandlerFactory),
    ),
    Router().use(
      '/users',
      Router()
        .get(
          '/:id',
          asMiddleware(authorizationMiddlewareFactory),
          createGetUserValidator(),
          asHandler(getUserHandlerFactory),
        )
        .post(
          '/',
          createCreateUserValidator(),
          asHandler(createUserHandlerFactory),
        )
        .post(
          '/register',
          createCreateUserValidator(),
          asHandler(registerUserHandlerFactory),
        )
        .post(
          '/activate/:token',
          createActivateUserValidator(),
          asHandler(activateUserHandlerFactory),
        ),
    ),
    Router().use(
      '/auctions/seller/auction',
      Router().post(
        '/',
        asMiddleware(authorizationMiddlewareFactory),
        asMiddleware(checkSellerUserRoleFactory),
        // TODO: add validator
        asHandler(registerAuctionHandlerFactory),
      ),
    ),
  ];
}
