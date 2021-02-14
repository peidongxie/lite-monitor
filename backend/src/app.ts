import Koa from 'koa';
import { MongoClient } from 'mongodb';
import Router from '@koa/router';
import { HOST, PASSWORD, PORT, USERNAME } from './config/database';

export const server: Koa = new Koa();

export const router: Router = new Router();

export const database: MongoClient = new MongoClient(
  `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`,
  { useUnifiedTopology: true },
);
