import express, { Express, Request, Response } from 'express';
import createConfig from './config';

const config = createConfig(process.env);

const app: Express = express();

app.get('/', (req: Request, res: Response) => res.send('hello, world'));

app.listen(config.appPort, () => console.log(`${config.appName} server running on ${config.appPort}`));
