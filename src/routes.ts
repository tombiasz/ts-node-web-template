import { Router } from 'express';
import {
  createHealthHandler,
  createHelloHandler
} from './handlers';

const healthHandler = createHealthHandler();

export function createAppRoutes(): Router | Router[] {
  return [
    Router()
      .get('/', createHelloHandler({ name: 'Fizz Buzz' }))
      .post('/', createHelloHandler({ name: 'Foo Bar' })),
    Router()
      .get('/health', healthHandler),
  ];
}
