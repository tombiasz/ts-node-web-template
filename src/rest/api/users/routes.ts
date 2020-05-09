import { Router } from 'express';
import { asHandler } from '../../shared/handler';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';
import {
  getUserHandlerFactory,
  createUserHandlerFactory,
  registerUserHandlerFactory,
  activateUserHandlerFactory,
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
      createCreateUserValidator(),
      asHandler(activateUserHandlerFactory),
    );
}
