import Koa from 'koa';
import { MongoClient } from 'mongodb';
import Router from '@koa/router';
import { HOST, PASSWORD, PORT, USERNAME } from './config/database';

export const database: MongoClient = new MongoClient(
  `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`,
  { useUnifiedTopology: true },
);

export const logger: Console = console;

export const router: Router = new Router();

export const server: Koa = new Koa();
