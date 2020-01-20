import * as winston from 'winston';
import { Config } from "./config";

interface LogMethod {
  (message: string, context?: object): void
}

export interface Logger {
  info: LogMethod
  error: LogMethod
  warn: LogMethod
  debug: LogMethod
}

class AppLogger implements Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  debug(message: string, context?: object) {
    this.logger.debug(message, context);
  }

  error(message: string, context?: object) {
    this.logger.error(message, context);
  }

  warn(message: string, context?: object) {
    this.logger.warn(message, context);
  }

  info(message: string, context?: object) {
    this.logger.info(message, context);
  }
}

export default function createLogger(): Logger {
  return new AppLogger();
}
