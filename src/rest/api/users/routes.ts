import { Router } from 'express';
import { createCreateUserHandler } from './createUser';
import { createGetUserHandler } from './getUser';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';
import { DB } from '../../../database';

interface UserRoutesProps {
  db: DB;
}

export function createUserRoutes({ db }: UserRoutesProps): Router {
  return Router()
    .get('/:id', createGetUserValidator(), createGetUserHandler({ db }))
    .post('/', createCreateUserValidator(), createCreateUserHandler({ db }));
}
