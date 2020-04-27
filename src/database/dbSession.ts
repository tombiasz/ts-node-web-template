import { JsonDB } from 'node-json-db';
import { Config as JsonDBConfig } from 'node-json-db/dist/lib/JsonDBConfig';
import { IConfig } from '../config';
import { ILogger } from '../logger';

export type DbSession = JsonDB;

type DbSessionFactory = ({
  config,
  logger,
}: {
  config: IConfig;
  logger: ILogger;
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
