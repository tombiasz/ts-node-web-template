import { Request, Response } from 'express';

export function createHealthHandler() {
  return (req: Request, res: Response) => res.json({ message: 'ok' });
}
