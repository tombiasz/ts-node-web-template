import express from 'express';
import { ILogger } from '../../logger';
import {
  createErrorsHandler,
  createForceJSONPayloadHandler,
  createHealthCheckHandler,
  createRouteNotFoundHandler,
  createRequestLogger,
  createRequestDbSession,
} from './handlers';
import { IConfig } from '../../config';
import { Server as HttpServer } from 'http';
import { createApiRoutes } from '../api/routes';
import { DbSession } from '../../database/dbSession';

declare global {
  namespace Express {
    interface Request {
      logger: ILogger;
      db: DbSession;
    }
  }
}

export type ServerProps = {
  logger: ILogger;
  config: IConfig;
};

interface Server {
  start: () => Promise<number>;
  stop: () => Promise<void>;
}

type ServerFactory = (context: ServerProps) => Server;

export const createServer: ServerFactory = ({ logger, config }) => {
  let server: HttpServer | null = null;
  let isShuttingDown = false;

  const app = express()
    .disable('x-powered-by')
    .use(createForceJSONPayloadHandler())
    .use(createRequestLogger({ logger }))
    .use(createRequestDbSession({ config }))
    .use('/api', createApiRoutes())
    .use(
      '/health',
      createHealthCheckHandler(() => !isShuttingDown),
    )
    .use(createErrorsHandler())
    .use(createRouteNotFoundHandler());

  return {
    start(): Promise<number> {
      const { appPort: port } = config;

      if (server) {
        return Promise.resolve(port);
      }

      return new Promise((resolve, reject) => {
        server = app
          .listen(port, () => resolve(port))
          .on('error', (error) => reject(error));
      });
    },

    stop(): Promise<void> {
      isShuttingDown = true;

      if (!server) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        server!.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
};
