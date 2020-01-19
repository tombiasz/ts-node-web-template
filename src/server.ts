import { Express, Request, Response } from 'express';
import { Config } from './config';

export class AppServer {
  constructor(
    readonly httpServer: Express,
    readonly config: Config,
  ) {
    httpServer.get('/', (req: Request, res: Response) => res.send('hello, world'));
  }

  start(): Promise<{}>{
    const { appPort, appName } = this.config;

    return new Promise((resolve) => {
      this.httpServer.listen(appPort, () => {
        console.log(`${appName} server running on ${appPort}`);
        resolve();
      });
    });
  }
}

export default function createAppServer(httpServer: Express, config: Config) {
  return new AppServer(httpServer, config);
}
