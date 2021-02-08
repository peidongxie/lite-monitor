import { Middleware } from 'koa';
import { MongoClient } from 'mongodb';
import { HOST, NAME, PASSWORD, PORT, USERNAME } from '../config/db';
import { error, info } from './log';
import { ContextState } from './types';

const initDatabase = async (client: MongoClient): Promise<void> => {
  const db = client.db(NAME);
  const collections = await db.collections();
  const names = collections.map((collection) => collection.collectionName);
  if (names.every((name) => name !== 'project_info')) {
    await db.createCollection('project_info');
  }
};

export const getMiddleware = (): Middleware<ContextState> => {
  const client = new MongoClient(
    `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`,
    { useUnifiedTopology: true },
  );
  client
    .connect()
    .then(() => info('Database is connected.'))
    .then(() => initDatabase(client))
    .then(() => info('Database is initialized.'))
    .catch((reason) => error(reason));
  return async (ctx, next) => {
    ctx.state = client;
    await next();
  };
};
