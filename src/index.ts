import { createConfig } from './config';
import { createLogger } from './logger';
import { createServer } from './rest';
import { createRepositories } from './database';

enum Signal {
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

const config = createConfig(process.env);
const logger = createLogger();
const repositories = createRepositories({ config });
const server = createServer({ logger, config, repositories });

const shutdown = async (signal: Signal): Promise<void> => {
  try {
    logger.info(`Received ${signal}. Shutting down server`);

    await server.stop();

    logger.info('Server stopped');

    process.exit(0);
  } catch (error) {
    logger.error('Error occurred stopping server', { error });

    process.exit(1);
  }
};

process.on(Signal.SIGTERM, () => shutdown(Signal.SIGTERM));
process.on(Signal.SIGINT, () => shutdown(Signal.SIGINT));

server
  .start()
  .then(port => logger.info('Server running', { port }))
  .catch(error => {
    logger.error('Error occurred starting server', { error });

    process.exit(1);
  });
