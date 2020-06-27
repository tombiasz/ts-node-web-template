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
import {
  registerAuctionHandlerFactory,
  withdrawAuctionHandlerFactory,
} from './auctions/factories';
import {
  createCreateAuctionValidator,
  createWithdrawnAuctionValidator,
  createAuctionIdValidator,
} from './auctions/validators';

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
        createCreateAuctionValidator(),
        asHandler(registerAuctionHandlerFactory),
      ),
      Router().use(
        '/:auctionId',
        createAuctionIdValidator(),
        Router({ mergeParams: true }).delete(
          '/',
          asMiddleware(authorizationMiddlewareFactory),
          asMiddleware(checkSellerUserRoleFactory),
          createWithdrawnAuctionValidator(),
          asHandler(withdrawAuctionHandlerFactory),
        ),
      ),
    ),
  ];
}
