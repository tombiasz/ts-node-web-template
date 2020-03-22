import { Router } from 'express';
import { createCreateUserHandler } from './createUser';
import { createGetUserHandler } from './getUser';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';
import { Logger } from '../../../logger';
import { DB } from '../../../database';

interface UserRoutesProps {
  logger: Logger;
  db: DB;
}

export function createUserRoutes({ logger, db }: UserRoutesProps): Router {
  return Router()
    .get(
      '/users/:id',
      createGetUserValidator(),
      createGetUserHandler({ logger, db }),
    )
    .post(
      '/users',
      createCreateUserValidator(),
      createCreateUserHandler({ logger, db }),
    );
}
