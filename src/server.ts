import express, { Express, Router, Request, Response, NextFunction } from 'express';
import { Config } from './config';
import { Logger } from './logger';
import createRouter from './router';
import bodyParser from 'body-parser';

declare global {
  namespace Express {
    interface Request {
      logger: Logger
    }
  }
}

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

  attachLoggerToRequest(): this {
    const { httpServer, logger } = this;

    if (httpServer._router) {
      logger.warn('Logger should be attach before router. Otherwise it may cause unexpected behavior');
    }

    httpServer.use((req: Request, res: Response, next: NextFunction) => {
      req.logger = logger;
      next();
    });

    return this;
  }

  forceJSONBody(): this{
    this.httpServer.use(bodyParser.json({
      type: () => true,
    }));
    return this;
  }

  start(): Promise<this> {
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
    .forceJSONBody()
    .disableXPoweredByBanner()
    .attachLoggerToRequest()
    .attachRouter(createRouter());
}
