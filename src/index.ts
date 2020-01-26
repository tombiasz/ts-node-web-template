import { Router } from 'express';
import { createConfig } from './config';
import { createAppServer } from './server';
import { createLogger, Logger } from './logger';
import {
  createForceJSONMiddleware,
  createHandleHttpErrorsMiddleware,
  createAttachLoggerMiddleware,
  createHandleJSONErrorsMiddleware,
  createUnknownRouteHandler,
} from './handlers';
import { createAppRoutes } from './routes';

declare global {
  namespace Express {
    interface Request {
      logger: Logger
    }
  }
}

const config = createConfig(process.env);
const logger = createLogger();
const appRouter = Router()
    .use(createAttachLoggerMiddleware(logger))
    .use(createForceJSONMiddleware())
    .use(createAppRoutes())
    .use(createHandleHttpErrorsMiddleware())
    .use(createHandleJSONErrorsMiddleware())
    .use(createUnknownRouteHandler());

createAppServer()
  .setAppName(config.appName)
  .disableXPoweredByBanner()
  .attachLogger(logger)
  .attachRouter(appRouter)
  .start(config.appPort);
