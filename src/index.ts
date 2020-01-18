import express, { Express, Request, Response } from 'express';

const appPort = process.env.APP_PORT;
const appName = process.env.APP_NAME;

const app: Express = express();

app.get('/', (req: Request, res: Response) => res.send('hello, world'));

app.listen(appPort, () => console.log(`${appName} server running on ${appPort}`));
