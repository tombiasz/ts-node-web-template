import { Router } from "express";
import { helloHandler, healthHandler, errorsHandler } from './handlers';

export function registerRoutes(router: Router): void {
  router.get('/', helloHandler);
  router.get('/health', healthHandler);
  router.use(errorsHandler);
}

export default function createRoutes(): Router {
  const router = Router();
  registerRoutes(router);
  return router;
}
