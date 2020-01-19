import { Router } from "express";
import { Request, Response } from 'express';

export function registerRoutes(router: Router): void {
  router.get('/', (req: Request, res: Response) => res.send('hello, world'));
}

export default function createRoutes(): Router {
  const router = Router();
  registerRoutes(router);
  return router;
}
