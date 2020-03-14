import { Router } from 'express';
import { createCreateUserHandler } from './createUser';
import { createGetUserHandler } from './getUser';

export function createUsersRoutes(): Router {
  return Router()
    .get('/users/:id', createGetUserHandler())
    .post('/users', createCreateUserHandler());
}
