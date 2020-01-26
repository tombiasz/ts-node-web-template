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
  createHandleUnhandledErrorsMiddleware,
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
    .use(createUnknownRouteHandler())
    .use(createHandleHttpErrorsMiddleware())
    .use(createHandleJSONErrorsMiddleware())
    .use(createHandleUnhandledErrorsMiddleware());

createAppServer()
  .setAppName(config.appName)
  .disableXPoweredByBanner()
  .attachLogger(logger)
  .attachRouter(appRouter)
  .start(config.appPort);
