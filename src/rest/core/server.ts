import express from 'express';
import { Logger } from '../../logger';
import {
  createErrorsHandler,
  createForceJSONPayloadHandler,
  createHealthCheckHandler,
  createRouteNotFoundHandler,
  createRequestContext,
} from './handlers';
import { Config } from '../../config';
import { Server } from 'http';
import { createApiRoutes } from '../api/routes';
import { DB } from '../../database';

declare global {
  namespace Express {
    interface Request {
      logger: Logger;
    }
  }
}

export type Context = {
  logger: Logger;
  config: Config;
  db: DB;
};

interface RestServer {
  start: () => Promise<number>;
  stop: () => Promise<void>;
}

type AppFactory = (context: Context) => RestServer;

export const createServer: AppFactory = ({ logger, config, db }) => {
  let server: Server | null = null;
  let isShuttingDown = false;

  const app = express()
    .disable('x-powered-by')
    .use(createForceJSONPayloadHandler())
    .use(createRequestContext({ logger }))
    .use('/api', createApiRoutes({ logger, db }))
    .use(
      '/health',
      createHealthCheckHandler(() => !isShuttingDown),
    )
    .use(createErrorsHandler())
    .use(createRouteNotFoundHandler());

  // TODO: set types for app.locals
  // cannot type local so move to req context
  app.locals = { logger, config, db };

  return {
    start(): Promise<number> {
      const { appPort: port } = config;

      if (server) {
        return Promise.resolve(port);
      }

      return new Promise((resolve, reject) => {
        server = app
          .listen(port, () => resolve(port))
          .on('error', error => reject(error));
      });
    },

    stop(): Promise<void> {
      isShuttingDown = true;

      if (!server) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        server!.close(error => (error ? reject(error) : resolve()));
      });
    },
  };
};
