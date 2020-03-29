import { JsonDB } from 'node-json-db';
import { Config as JsonDBConfig } from 'node-json-db/dist/lib/JsonDBConfig';
import { Config } from './config';
import { Logger } from './logger';

export type DbSession = JsonDB;

type DbSessionFactory = ({
  config,
  logger,
}: {
  config: Config;
  logger: Logger;
}) => JsonDB;

export const createDbSession: DbSessionFactory = ({ config, logger }) => {
  const saveOnPush = false;
  const humanReadable = false;
  const pathSeparator = '/';

  logger.debug('Request db session created');

  return new JsonDB(
    new JsonDBConfig(
      config.databaseName,
      saveOnPush,
      humanReadable,
      pathSeparator,
    ),
  );
};
