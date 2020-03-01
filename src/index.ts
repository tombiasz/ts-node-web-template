import { createConfig } from './config';
import { createLogger } from './logger';
import { createServer } from './rest';

enum Signal {
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

const config = createConfig(process.env);
const logger = createLogger();
const app = createServer({ logger, config });

const shutdown = async (signal: Signal): Promise<void> => {
  try {
    logger.info(`Received ${signal}. Shutting down server`);
    await app.stop();
    process.exit(0);
  } catch (error) {
     logger.error('Error occurred executing shutdown', { error });
     process.exit(1);
  }
}

process.on(Signal.SIGTERM, () => shutdown(Signal.SIGTERM));
process.on(Signal.SIGINT, () => shutdown(Signal.SIGINT));

app.start();
