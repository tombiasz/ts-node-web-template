import express from 'express';
import createConfig from './config';
import createAppServer from './server';

const config = createConfig(process.env);

createAppServer(express(), config)
  .start();
