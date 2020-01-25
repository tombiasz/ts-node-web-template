import { Router } from 'express';
import { createConfig } from './config';
import { createAppServer } from './server';
import { createLogger, Logger } from './logger';
import {
  createForceJSONMiddleware,
  createHandleErrorsMiddleware,
  createAttachLoggerMiddleware,
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
    .use(createForceJSONMiddleware())
    .use(createAttachLoggerMiddleware(logger))
    .use(createAppRoutes())
    .use(createHandleErrorsMiddleware());

createAppServer()
  .setAppName(config.appName)
  .disableXPoweredByBanner()
  .attachLogger(logger)
  .attachRouter(appRouter)
  .start(config.appPort);
