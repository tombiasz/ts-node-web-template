type Config = {
  appName: string;
  appPort: number;
  databaseName: string;
  loggerEnabled: boolean;
  loggerLevel: string;
  passwordBcryptRounds: number;
  jwtSecret: string;
  jwtAlgorithm: string;
  jwtExpiresIn: string;
};

const REQUIRED_KEYS: ReadonlyArray<string> = [
  'APP_PORT',
  'DATABASE_NAME',
  'PASSWORD_BCRYPT_ROUNDS',
  'JWT_SECRET',
  'JWT_ALGORITHM',
  'JWT_EXPIRES_IN',
];

const checkRequiredKeys = (env: NodeJS.ProcessEnv): void => {
  const envKeys = Object.keys(env);

  REQUIRED_KEYS.forEach((key) => {
    if (!envKeys.includes(key)) {
      throw new Error(`missing required config key ${key}`);
    }
  });
};

const asInt = (value: string) => Number.parseInt(value, 10);

const asBool = (value: string) => value === '1' || value === 'true';

const createConfig = (env: NodeJS.ProcessEnv): Readonly<Config> => {
  checkRequiredKeys(env);

  return Object.freeze({
    appName: env.APP_NAME || 'App',
    appPort: asInt(env.APP_PORT as string),
    databaseName: env.DATABASE_NAME as string,
    loggerEnabled: asBool(env.LOGGER_ENABLED as string),
    loggerLevel: env.LOGGER_LEVEL || 'info',
    passwordBcryptRounds: asInt(env.PASSWORD_BCRYPT_ROUNDS as string),
    jwtSecret: env.JWT_SECRET as string,
    jwtAlgorithm: env.JWT_ALGORITHM as string,
    jwtExpiresIn: env.JWT_EXPIRES_IN as string,
  });
};

export const config = createConfig(process.env);
