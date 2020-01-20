import express, { Express, Router } from 'express';
import { Config } from './config';
import { Logger } from './logger';
import createRouter from './router';

export class AppServer {
  constructor(
    readonly httpServer: Express,
    readonly config: Config,
    readonly logger: Logger,
  ) {}

  disableXPoweredByBanner(): this {
    this.httpServer.disable('x-powered-by');
    return this;
  }

  attachRouter(router: Router): this {
    this.httpServer.use(router);
    return this;
  }

  start(): Promise<this>{
    const { appPort, appName } = this.config;

    return new Promise((resolve) => {
      this.httpServer.listen(appPort, () => {
        this.logger.info('App server running', { appName, appPort });
        resolve(this);
      });
    });
  }
}

export default function createAppServer(config: Config, logger: Logger) {
  return new AppServer(express(), config, logger)
    .disableXPoweredByBanner()
    .attachRouter(createRouter());
}
