import { Request, Response } from 'express';

export default function createHelloHandler(name: string = 'world') {
  return (req: Request, res: Response) => {
    req.logger.info('Hello handler called')
    res.send(`hello, ${name}`);
  }
}
