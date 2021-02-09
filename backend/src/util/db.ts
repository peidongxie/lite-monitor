import { Middleware } from 'koa';
import {
  Collection,
  FilterQuery,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoClient,
  OptionalId,
  WithId,
} from 'mongodb';
import { HOST, NAME, PASSWORD, PORT, USERNAME } from '../config/db';
import { ContextState } from '../type/app';
import { error, info, warn } from './log';

export const getCollection = <T>(
  client: MongoClient,
  name: string,
): Collection<T> => {
  const db = client.db(NAME);
  return db.collection(name);
};

export const createCollection = async <T>(
  client: MongoClient,
  name: string,
): Promise<Collection<T> | null> => {
  const db = client.db(NAME);
  try {
    const collection = await db.createCollection(name);
    info(`Collection '${name}' is created.`);
    return collection;
  } catch (e) {
    error(`Failed to create collection '${name}'.`);
    error(e.toString());
    return null;
  }
};

export const addDocument = async <T>(
  client: MongoClient,
  name: string,
  data: OptionalId<T> | OptionalId<T>[],
): Promise<
  InsertWriteOpResult<WithId<T>> | InsertOneWriteOpResult<WithId<T>> | null
> => {
  const collection = getCollection<T>(client, name);
  try {
    if (Array.isArray(data)) {
      const { length } = data;
      const result = await collection.insertMany(data);
      if (length === 0) {
        warn(`No documents are inserted into the collection '${name}'.`);
      } else {
        info(`Some documents were inserted into the collection '${name}'.`);
      }
      return result;
    } else {
      const result = await collection.insertOne(data);
      info(`Some documents were inserted into the collection '${name}'.`);
      return result;
    }
  } catch (e) {
    error(`Failed to insert some documents into the collection '${name}'.`);
    error(e.toString());
    return null;
  }
};

export const findDocument = async <T>(
  client: MongoClient,
  name: string,
  query?: FilterQuery<T>,
): Promise<T[] | null> => {
  const collection = getCollection<T>(client, name);
  try {
    const result = await collection.find(query).toArray();
    info(`Some documents are found in the collection '${name}'.`);
    return result;
  } catch (e) {
    error(`Failed to find some documents in the collection '${name}'.`);
    error(e.toString());
    return null;
  }
};

export const getMiddleware = (
  initDatabase: (client: MongoClient) => Promise<void>,
): Middleware<ContextState> => {
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
