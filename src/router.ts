import { Router } from "express";
import { helloHandler, healthHandler } from './handlers';

export function registerRoutes(router: Router): void {
  router.get('/', helloHandler);
  router.get('/health', healthHandler);
}

export default function createRoutes(): Router {
  const router = Router();
  registerRoutes(router);
  return router;
}
