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

enum Signal {
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

const shutdown = async (signal: Signal): Promise<void> => {
  try {
    await app.stop();
    logger.info(`Received ${signal}. Shutting down server`);
    process.exit(0);
  } catch (error) {
     logger.error('Error occurred executing shutdown', { error });
     process.exit(1);
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

const app = createAppServer()
  .setAppName(config.appName)
  .disableXPoweredByBanner()
  .attachLogger(logger)
  .attachRouter(appRouter);

app.start(config.appPort);

process.on(Signal.SIGTERM, () => shutdown(Signal.SIGTERM));
process.on(Signal.SIGINT, () => shutdown(Signal.SIGINT));
