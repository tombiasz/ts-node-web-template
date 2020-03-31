import { Router } from 'express';
import { createHelloHandler } from './hello';
import { createUserRoutes } from './users/routes';

export function createApiRoutes(): Router | Router[] {
  return [
    Router()
      .get('/', createHelloHandler({ name: 'Fizz Buzz' }))
      .post('/', createHelloHandler({ name: 'Foo Bar' })),
    Router().use('/users', createUserRoutes()),
  ];
}
