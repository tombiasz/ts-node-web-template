import express, { Express, Router } from 'express';
import { Logger } from './logger';

export class AppServer {
  private appName: string = 'App';
  private logger: Logger = console;

  constructor(
    readonly httpServer: Express,
  ) {}

  setAppName(name: string) : this {
    this.appName = name;
    return this;
  }

  disableXPoweredByBanner(): this {
    this.httpServer.disable('x-powered-by');
    return this;
  }

  attachLogger(logger: Logger): this {
    this.logger = logger;
    return this;
  }

  attachRouter(router: Router): this {
    this.httpServer.use('/', router);
    return this;
  }

  start(appPort: number): Promise<this> {
    const { appName } = this;

    return new Promise((resolve) => {
      this.httpServer.listen(appPort, () => {
        this.logger.info('App server running', { appName, appPort });
        resolve(this);
      });
    });
  }
}

export function createAppServer(httpServer: Express = express()) {
  return new AppServer(httpServer);
}
