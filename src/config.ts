export interface Config {
  appName: string;
  appPort: number;
  databaseName: string;
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

export function createConfig(env: NodeJS.ProcessEnv): Readonly<Config> {
  checkRequiredKeys(env);

  return {
    appName: env.APP_NAME || 'App',
    appPort: Number.parseInt(env.APP_PORT as string, 10),
    databaseName: env.DATABASE_NAME as string,
  };
}
