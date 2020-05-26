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

export function createApiRoutes(): Router | Router[] {
  return [
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
    Router().post(
      '/auth',
      createAuthenticateValidator(),
      asHandler(authenticateHandlerFactory),
    ),
  ];
}
