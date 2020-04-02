import { Router } from 'express';
import { createCreateUserHandler } from './createUserHandler';
import { createGetUserHandler } from './getUserHandler';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';

export function createUserRoutes(): Router {
  return Router()
    .get('/:id', createGetUserValidator(), createGetUserHandler({}))
    .post('/', createCreateUserValidator(), createCreateUserHandler({}));
}
