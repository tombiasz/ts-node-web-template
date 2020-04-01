import { Router } from 'express';
import { createCreateUserHandler } from './createUser';
import { createGetUserHandler } from './getUser';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';

export function createUserRoutes(): Router {
  return Router()
    .get('/:id', createGetUserValidator(), createGetUserHandler({}))
    .post('/', createCreateUserValidator(), createCreateUserHandler({}));
}
