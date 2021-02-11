import { Middleware } from 'koa';
import {
  Collection,
  DeleteWriteOpResultObject,
  FilterQuery,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoClient,
  OptionalId,
  UpdateQuery,
  WithId,
} from 'mongodb';
import { HOST, NAME, PASSWORD, PORT, USERNAME } from '../config/db';
import { ContextState } from '../type/app';
import { BaseSchema } from '../type/db';
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

export const findDocument = async <T extends BaseSchema>(
  client: MongoClient,
  name: string,
  filter?: FilterQuery<T>,
): Promise<T[] | null> => {
  const collection = getCollection<T>(client, name);
  try {
    const result = await collection.find(filter).toArray();
    info(`Collection '${name}': Some documents are found.`);
    return result;
  } catch (e) {
    error(`Collection '${name}': Failed to find some documents.`);
    error(e.toString());
    return null;
  }
};

export const addDocument = async <T extends BaseSchema>(
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
        warn(`Collection '${name}': No documents are inserted.`);
      } else {
        info(`Collection '${name}': Some documents were inserted.`);
      }
      return result;
    } else {
      const result = await collection.insertOne(data);
      info(`Collection '${name}': Some documents were inserted.`);
      return result;
    }
  } catch (e) {
    error(`Collection '${name}': Failed to insert some documents.`);
    error(e.toString());
    return null;
  }
};

export const removeDocument = async <T extends BaseSchema>(
  client: MongoClient,
  name: string,
  filter: FilterQuery<T>,
): Promise<DeleteWriteOpResultObject | null> => {
  const collection = getCollection<T>(client, name);
  try {
    const result = await collection.deleteMany(filter);
    info(`Collection '${name}': Some documents were deleted.`);
    return result;
  } catch (e) {
    error(`Collection '${name}': Failed to delete some documents.`);
    error(e.toString());
    return null;
  }
};

export const changeDocument = async <T extends BaseSchema>(
  client: MongoClient,
  name: string,
  filter: FilterQuery<T>,
  update: UpdateQuery<T>,
): Promise<DeleteWriteOpResultObject | null> => {
  const collection = getCollection<T>(client, name);
  try {
    const result = await collection.updateMany(filter, update);
    info(`Collection '${name}': Some documents were changed.`);
    return result;
  } catch (e) {
    error(`Collection '${name}': Failed to change some documents.`);
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
