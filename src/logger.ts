import pino from 'pino';

type LogMethod = (message: string, context?: object) => void;

export interface Logger {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
  setContext(context: object): Logger;
}

class AppLogger implements Logger {
  private logger: pino.Logger;

  constructor(logger: pino.Logger) {
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

  setContext(context: object) {
    return new AppLogger(this.logger.child(context));
  }
}

export const createLogger = () => new AppLogger(pino());
