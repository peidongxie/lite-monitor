import { Middleware } from 'koa';
import { MongoClient } from 'mongodb';
import { HOST, NAME, PASSWORD, PORT, USERNAME } from '../config/db';
import { error, info } from './log';
import { ContextState } from './types';

export const getMiddleware = (): Middleware<ContextState> => {
  const client = new MongoClient(
    `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${NAME}?authSource=admin`,
    { useUnifiedTopology: true },
  );
  client
    .connect()
    .then(() => info('Database is connected.'))
    .catch((e) => error(e));
  return async (ctx, next) => {
    ctx.state = client;
    await next();
  };
};
