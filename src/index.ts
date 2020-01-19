import express from 'express';
import createConfig from './config';
import createAppServer from './server';
import createLogger from './logger';

const config = createConfig(process.env);
const logger = createLogger();

createAppServer(express(), config, logger)
  .start();
