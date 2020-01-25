import { Router } from 'express';
import {
  createHelloHandler,
  createHealthHandler,
} from './handlers';

const helloHandler = createHelloHandler('foo bar');
const healthHandler = createHealthHandler();

export function createAppRoutes(): Router | Router[] {
  return [
    Router()
      .get('/', helloHandler)
      .post('/', helloHandler),
    Router()
      .get('/health', healthHandler),
  ];
}
