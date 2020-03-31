import { Router } from 'express';
import { CreateUserHandler } from './createUser';
import { GetUserHandler } from './getUser';
import {
  createCreateUserValidator,
  createGetUserValidator,
} from './validators';
import { UserJsonDBRepository } from './userRepository';

export function createUserRoutes(): Router {
  return Router()
    .get('/:id', createGetUserValidator(), (req, res, next) => {
      const logger = req.logger;
      const db = req.db;
      const userRepo = new UserJsonDBRepository({ logger, db });

      new GetUserHandler({ userRepo }).handle(req, res, next);
    })
    .post('/', createCreateUserValidator(), (req, res, next) => {
      const logger = req.logger;
      const db = req.db;
      const userRepo = new UserJsonDBRepository({ logger, db });

      new CreateUserHandler({ db, userRepo }).handle(req, res, next);
    });
}
