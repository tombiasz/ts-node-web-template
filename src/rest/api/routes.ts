import { Router } from 'express';
import { createUserRoutes } from './users/routes';

export function createApiRoutes(): Router | Router[] {
  return [Router().use('/users', createUserRoutes())];
}
