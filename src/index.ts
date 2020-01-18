import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => res.send('hello, world'));

app.listen(8000, () => console.log('server running on 8000'));
