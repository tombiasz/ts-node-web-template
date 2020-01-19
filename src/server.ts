import express, { Express, Request, Response } from 'express';
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

  disableXPoweredByBanner(): this {
    this.httpServer.disable('x-powered-by');
    return this;
  }

  start(): Promise<this>{
    const { appPort, appName } = this.config;

    return new Promise((resolve) => {
      this.httpServer.listen(appPort, () => {
        this.logger.info(`${appName} server running on ${appPort}`);
        resolve(this);
      });
    });
  }
}

export default function createAppServer(config: Config, logger: Logger) {
  return new AppServer(express(), config, logger)
    .disableXPoweredByBanner();
}
