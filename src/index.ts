import createConfig from './config';
import createAppServer from './server';
import createLogger from './logger';

const config = createConfig(process.env);
const logger = createLogger();

createAppServer(config, logger)
  .start();
