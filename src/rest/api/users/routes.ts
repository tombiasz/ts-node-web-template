import { Router } from 'express';
import { asHandler } from '../../shared/handler';
import {
  createCreateUserValidator,
  createGetUserValidator,
  createActivateUserValidator,
  createAuthenticateValidator,
} from './validators';
import {
  getUserHandlerFactory,
  createUserHandlerFactory,
  registerUserHandlerFactory,
  activateUserHandlerFactory,
  authenticateHandlerFactory,
} from './factories';

export function createUserRoutes(): Router {
  return Router()
    .get('/:id', createGetUserValidator(), asHandler(getUserHandlerFactory))
    .post('/', createCreateUserValidator(), asHandler(createUserHandlerFactory))
    .post(
      '/register',
      createCreateUserValidator(),
      asHandler(registerUserHandlerFactory),
    )
    .post(
      '/activate/:token',
      createActivateUserValidator(),
      asHandler(activateUserHandlerFactory),
    )
    .post(
      '/auth',
      createAuthenticateValidator(),
      asHandler(authenticateHandlerFactory),
    );
}
