import { Router } from 'express';
import { createCreateUserHandler } from './createUser';
import { createGetUserHandler } from './getUser';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';

export function createUsersRoutes(): Router {
  return Router()
    .get('/users/:id', createGetUserValidator(), createGetUserHandler())
    .post('/users', createCreateUserValidator(), createCreateUserHandler());
}
