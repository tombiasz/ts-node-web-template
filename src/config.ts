export interface Config {
  appName: string;
  appPort: number;
  databaseName: string;
  loggerEnabled: boolean;
  loggerLevel: string;
}

const REQUIRED_KEYS: ReadonlyArray<string> = ['APP_PORT', 'DATABASE_NAME'];

const checkRequiredKeys = (env: NodeJS.ProcessEnv): void => {
  const envKeys = Object.keys(env);

  REQUIRED_KEYS.forEach(key => {
    if (!envKeys.includes(key)) {
      throw new Error(`missing required config key ${key}`);
    }
  });
};

const asInt = (value: string) => Number.parseInt(value, 10);

const asBool = (value: string) => value === '1' || value === 'true';

export function createConfig(env: NodeJS.ProcessEnv): Readonly<Config> {
  checkRequiredKeys(env);

  return {
    appName: env.APP_NAME || 'App',
    appPort: asInt(env.APP_PORT as string),
    databaseName: env.DATABASE_NAME as string,
    loggerEnabled: asBool(env.LOGGER_ENABLED as string),
    loggerLevel: env.LOGGER_LEVEL || 'info',
  };
}
