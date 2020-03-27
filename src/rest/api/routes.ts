import { Router } from 'express';
import { createHelloHandler } from './hello';
import { createUserRoutes } from './users/routes';
import { Logger } from '../../logger';
import { DB } from '../../database';

interface ApiRoutesProps {
  logger: Logger;
  db: DB;
}

export function createApiRoutes({
  logger,
  db,
}: ApiRoutesProps): Router | Router[] {
  return [
    Router()
      .get('/', createHelloHandler({ name: 'Fizz Buzz' }))
      .post('/', createHelloHandler({ name: 'Foo Bar' })),
    Router().use('/users', createUserRoutes({ db })),
  ];
}
