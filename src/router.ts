import { Router } from "express";
import { helloHandler } from './handlers';

export function registerRoutes(router: Router): void {
  router.get('/', helloHandler);
}

export default function createRoutes(): Router {
  const router = Router();
  registerRoutes(router);
  return router;
}
