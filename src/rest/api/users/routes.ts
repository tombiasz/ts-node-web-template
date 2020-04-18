import { Router } from 'express';
import { asHandler } from '../../shared/handler';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';
import { getUserHandlerFactory } from './getUserHandler';
import { createUserHandlerFactory } from './createUserHandler';

export function createUserRoutes(): Router {
  return Router()
    .get('/:id', createGetUserValidator(), asHandler(getUserHandlerFactory))
    .post(
      '/',
      createCreateUserValidator(),
      asHandler(createUserHandlerFactory),
    );
}
