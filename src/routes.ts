import { Router } from 'express';
import {
  createHealthHandler,
  HelloHandler
} from './handlers';

const healthHandler = createHealthHandler();

export function createAppRoutes(): Router | Router[] {
  return [
    Router()
      .get('/', HelloHandler.asHandler({ name: 'Fizz Buzz' }))
      .post('/', HelloHandler.asHandler({ name: 'Foo Bar' })),
    Router()
      .get('/health', healthHandler),
  ];
}
