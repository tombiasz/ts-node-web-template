export interface Config {
  appName: string
  appPort: number
}

const REQUIRED_KEYS : ReadonlyArray<string> = [
  'APP_PORT',
];

const checkRequiredKeys = (env: NodeJS.ProcessEnv) : void => {
  const envKeys = Object.keys(env);

  REQUIRED_KEYS.forEach(key => {
    if (!envKeys.includes(key)) {
      throw new Error(`missing required config key ${key}`);
    }
  });
}

export default function createConfig(env: NodeJS.ProcessEnv) : Readonly<Config> {
  checkRequiredKeys(env);

  return {
    appName: env.APP_NAME || 'App',
    appPort: Number.parseInt(env.APP_PORT as string, 10),
  };
}
