import { Router } from 'express';
import { createUserHandlerFactory } from './createUserHandler';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';
import { asHandler } from '../../shared/handler';
import { createGetUserHandler } from './getUserHandler';

export function createUserRoutes(): Router {
  return Router()
    .get('/:id', createGetUserValidator(), createGetUserHandler({}))
    .post(
      '/',
      createCreateUserValidator(),
      asHandler(createUserHandlerFactory),
    );
}
