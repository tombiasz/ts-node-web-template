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
  start: () => Promise<void>
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
    async start(): Promise<void> {
      const { appPort: port } = config;

      if (!server) {
        return new Promise((resolve, reject) => {
          server = app.listen(port, (error) => {
            if (error) {
              logger.error('Error starting app server', { port, error });
              reject(error);
            }

            logger.info('App server running', { port });
            resolve();
          });
        })
      }
    },

    async stop(): Promise<void> {
      if (server) {
        isShuttingDown = true;

        return new Promise((resolve, reject) => {
          server!.close((error) => {
            if (error) {
              logger.error('Error stopping server', { error })
              reject(error);
            }

            logger.info('Server stopped');
            resolve();
          })
        });
      }
    }
  }
}
