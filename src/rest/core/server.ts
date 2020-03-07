import express from "express";
import { Logger } from "../../logger";
import {
  createErrorsHandler,
  createForceJSONPayloadHandler,
  createHealthCheckHandler,
  createRouteNotFoundHandler,
} from './handlers';
import { Config } from "../../config";
import { Server } from "http";
import { createApiRoutes } from '../api/routes';

export type Context = {
  logger: Logger;
  config: Config;
}

interface RestServer {
  start: () => Promise<number>
  stop: () => Promise<void>
}

type AppFactory = (context: Context) => RestServer;

export const createServer: AppFactory = ({ logger, config }) => {
  let server: Server | null = null;
  let isShuttingDown = false;

  const app = express()
    .disable('x-powered-by')
    .use(createForceJSONPayloadHandler())
    .use('/api', createApiRoutes())
    .use('/health', createHealthCheckHandler(() => !isShuttingDown))
    .use(createErrorsHandler())
    .use(createRouteNotFoundHandler());

  app.locals = { logger, config }

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
      })
    },

    stop(): Promise<void> {
      isShuttingDown = true;

      if (!server) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        server!.close(error => error
            ? reject(error)
            : resolve()
        )
      });
    }
  }
}
