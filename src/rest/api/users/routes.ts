import { Router } from 'express';
import { CreateUserHandler } from './createUser';
import { createGetUserHandler } from './getUser';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';
import { UserJsonDBRepository } from './userRepository';

export function createUserRoutes(): Router {
  return Router()
    .get('/:id', createGetUserValidator(), createGetUserHandler({}))
    .post('/', createCreateUserValidator(), (req, res, next) => {
      const logger = req.logger;
      const db = req.db;
      const userRepo = new UserJsonDBRepository({ logger, db });

      new CreateUserHandler({ db, userRepo }).handle(req, res, next);
    });
}
