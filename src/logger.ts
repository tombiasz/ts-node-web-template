import pino from 'pino';
import { config } from './config';

type LogMethod = (message: string, context?: object) => void;

export interface ILogger {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
  withContext(context: object): ILogger;
}

class AppLogger implements ILogger {
  private logger: pino.Logger;

  private constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  debug(message: string, context: object = {}) {
    this.logger.debug(context, message);
  }

  error(message: string, context: object = {}) {
    this.logger.error(context, message);
  }

  warn(message: string, context: object = {}) {
    this.logger.warn(context, message);
  }

  info(message: string, context: object = {}) {
    this.logger.info(context, message);
  }

  withContext(context: object) {
    return new AppLogger(this.logger.child(context));
  }

  static create() {
    return new this(
      pino({
        enabled: config.loggerEnabled,
        level: config.loggerLevel,
      }),
    );
  }
}

export const logger = AppLogger.create();
