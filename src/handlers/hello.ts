import { Request, Response } from 'express';

export default function createHelloHandler(name: string = 'world') {
  return (req: Request, res: Response) => res.send(`hello, ${name}`);
}
