import { Express, Request, Response } from 'express';
import { Config } from './config';
import { Logger } from './logger';

export class AppServer {
  constructor(
    readonly httpServer: Express,
    readonly config: Config,
    readonly logger: Logger,
  ) {
    httpServer.get('/', (req: Request, res: Response) => res.send('hello, world'));
  }

  start(): Promise<{}>{
    const { appPort, appName } = this.config;

    return new Promise((resolve) => {
      this.httpServer.listen(appPort, () => {
        this.logger.info(`${appName} server running on ${appPort}`);
        resolve();
      });
    });
  }
}

export default function createAppServer(httpServer: Express, config: Config, logger: Logger) {
  return new AppServer(httpServer, config, logger);
}
