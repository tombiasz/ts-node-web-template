import { UserJsonDBRepository } from './userRepository';
import { JsonDB } from 'node-json-db';
import { Config as JsonDBConfig } from 'node-json-db/dist/lib/JsonDBConfig';
import { Config } from '../config';

export type Repositories = {
  userRepository: UserJsonDBRepository;
};

type RepositoriesFactory = ({ config }: { config: Config }) => Repositories;

export const createRepositories: RepositoriesFactory = ({ config }) => {
  const db = new JsonDB(
    new JsonDBConfig(config.databaseName, true, false, '/'),
  );

  return {
    userRepository: new UserJsonDBRepository({ db }),
  };
};
