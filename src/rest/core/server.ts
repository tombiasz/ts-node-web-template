import express from 'express';
import { config } from '../../config';
import { ILogger } from '../../logger';
import {
  createErrorsHandler,
  createForceJSONPayloadHandler,
  createHealthCheckHandler,
  createRouteNotFoundHandler,
  createRequestLogger,
  createDefaultGetAuthorizedUser,
} from './handlers';
import { Server as HttpServer } from 'http';
import { createApiRoutes } from '../api/routes';
import { DbSession } from '@database/core';
import { AuthorizedUser } from './auth';

declare global {
  namespace Express {
    interface Request {
      logger: ILogger;
      db: DbSession;
      getAuthorizedUser(): AuthorizedUser;
    }
  }
}

interface Server {
  start: () => Promise<number>;
  stop: () => Promise<void>;
}

type ServerFactory = () => Server;

export const createServer: ServerFactory = () => {
  let server: HttpServer | null = null;
  let isShuttingDown = false;

  const app = express()
    .disable('x-powered-by')
    .use(createRequestLogger())
    .use(createForceJSONPayloadHandler())
    .use(createDefaultGetAuthorizedUser())
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
