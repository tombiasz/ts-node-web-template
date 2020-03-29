import { JsonDB } from 'node-json-db';
import { Config as JsonDBConfig } from 'node-json-db/dist/lib/JsonDBConfig';
import { Config } from './config';

type DbSessionFactory = ({ config }: { config: Config }) => JsonDB;

export const createDbSession: DbSessionFactory = ({ config }) => {
  const saveOnPush = false;
  const humanReadable = false;
  const pathSeparator = '/';

  return new JsonDB(
    new JsonDBConfig(
      config.databaseName,
      saveOnPush,
      humanReadable,
      pathSeparator,
    ),
  );
};
