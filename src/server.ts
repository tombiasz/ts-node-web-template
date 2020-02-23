import express, { Express, Router } from 'express';
import { Logger } from './logger';
import { Server } from 'http';

export class AppServer {
  private appName: string = 'App';
  private logger: Logger = console;
  private server: Server | null = null;

  constructor(
    readonly express: Express,
  ) {}

  setAppName(name: string): this {
    this.appName = name;
    return this;
  }

  disableXPoweredByBanner(): this {
    this.express.disable('x-powered-by');
    return this;
  }

  attachLogger(logger: Logger): this {
    this.logger = logger;
    return this;
  }

  attachRouter(router: Router): this {
    this.express.use('/', router);
    return this;
  }

  start(appPort: number): Promise<this> {
    const { appName } = this;

    return new Promise((resolve) => {
      this.server = this.express.listen(appPort, () => {
        this.logger.info('App server running', { appName, appPort });
        resolve(this);
      })
    });
  }

  stop(): Promise<void> {
    const { server, logger } = this;

    if(server) {
      return new Promise((resolve) => server.close(() => {
        logger.info('Server stopped');
        resolve();
      }));
    }

    return Promise.resolve();
  }
}

export function createAppServer(_express: Express = express()) {
  return new AppServer(_express);
}
