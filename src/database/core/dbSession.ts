import { JsonDB } from 'node-json-db';
import { Config as JsonDBConfig } from 'node-json-db/dist/lib/JsonDBConfig';
import { config } from 'src/config';

export type DbSession = JsonDB;

type DbSessionFactory = ({ databaseName }: { databaseName: string }) => JsonDB;

export const createDbSession: DbSessionFactory = ({ databaseName }) => {
  const saveOnPush = false;
  const humanReadable = false;
  const pathSeparator = '/';

  return new JsonDB(
    new JsonDBConfig(databaseName, saveOnPush, humanReadable, pathSeparator),
  );
};

export const db = createDbSession({ databaseName: config.databaseName });
