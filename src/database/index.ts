import { UserJsonDBRepository } from './userRepository';
import { JsonDB } from 'node-json-db';
import { Config as JsonDBConfig } from 'node-json-db/dist/lib/JsonDBConfig';
import { Config } from '../config';

export type DB = {
  users: UserJsonDBRepository;
};

type DBFactory = ({ config }: { config: Config }) => DB;

export const createDB: DBFactory = ({ config }) => {
  const db = new JsonDB(
    new JsonDBConfig(config.databaseName, true, false, '/'),
  );

  return {
    users: new UserJsonDBRepository({ db }),
  };
};
