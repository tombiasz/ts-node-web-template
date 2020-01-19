import { Request, Response } from 'express';

export default function healthHandler() {
  return (req: Request, res: Response) => res.send('ok');
}
