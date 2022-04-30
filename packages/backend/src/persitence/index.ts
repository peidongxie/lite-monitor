import mongodb, {
  type FastifyMongoNestedObject,
  type FastifyMongoObject,
  type FastifyMongodbOptions,
} from '@fastify/mongodb';
import {
  type Collection,
  type CollectionInfo,
  type DeleteResult,
  type Document,
  type InsertManyResult,
  type InsertOneResult,
  type Filter,
  type OptionalUnlessRequiredId,
  type UpdateFilter,
  type UpdateResult,
  type WithId,
} from 'mongodb';
import Config from '../config';
import Logger from '../logger';
import Server from '../server';
import { type BaseSchema } from '../type';

class Persitence {
  private static instance: Persitence;

  public static getInstance(): Persitence {
    if (!this.instance) this.instance = new Persitence();
    return this.instance;
  }

  private value?: FastifyMongoObject & FastifyMongoNestedObject;

  private constructor() {
    Server.getInstance().addListener('beforeListening', (event) => {
      event.register(mongodb, this.getFastifyMongodbOptions());
    });
    Server.getInstance().addListener('afterListening', (event) => {
      this.value = event.mongo;
    });
  }

  public collection<Schema extends BaseSchema>(
    name: string,
  ): Collection<Schema> | null {
    const db = this.value?.db;
    if (!db) return null;
    return db.collection<Schema>(name);
  }

  public async createCollection<Schema extends BaseSchema>(
    name: string,
  ): Promise<Collection<Schema> | null> {
    const db = this.value?.db;
    if (!db) return null;
    try {
      const collection = await db.createCollection<Schema>(name);
      return collection;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async createDocument<Schema extends BaseSchema>(
    name: string,
    doc: OptionalUnlessRequiredId<Schema>,
  ): Promise<InsertOneResult<Schema> | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.insertOne(doc);
      return result;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async createDocuments<Schema extends BaseSchema>(
    name: string,
    docs: OptionalUnlessRequiredId<Schema>[],
  ): Promise<InsertManyResult<Schema> | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.insertMany(docs);
      return result;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async deleteCollection(name: string): Promise<boolean | null> {
    const db = this.value?.db;
    if (!db) return null;
    try {
      const collection = await db.dropCollection(name);
      return collection;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async deleteDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<DeleteResult | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.deleteOne(filter);
      return result;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async deleteDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<DeleteResult | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.deleteMany(filter);
      return result;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  private getFastifyMongodbOptions(): FastifyMongodbOptions {
    const config = Config.getInstance();
    const { database, host, password, port, username } =
      config.getPersitenceConfig();
    return {
      forceClose: true,
      database,
      url: `mongodb://${username}:${password}@${host}:${port}`,
    };
  }

  public async retrieveCollections(
    filter: Document,
  ): Promise<
    (CollectionInfo | Pick<CollectionInfo, 'name' | 'type'>)[] | null
  > {
    const db = this.value?.db;
    if (!db) return null;
    try {
      const cursor = db.listCollections(filter);
      const collections = await cursor.toArray();
      return collections;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async retrieveDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<WithId<Schema> | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const document = await collection.findOne(filter);
      return document;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async retrieveDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<WithId<Schema>[] | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const cursor = await collection.find(filter);
      const documents = await cursor.toArray();
      return documents;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async updateCollection<Schema extends BaseSchema>(
    fromCollection: string,
    toCollection: string,
  ): Promise<Collection<Schema> | null> {
    const db = this.value?.db;
    if (!db) return null;
    try {
      const collection = await db.renameCollection<Schema>(
        fromCollection,
        toCollection,
      );
      return collection;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async updateDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
    update: UpdateFilter<Schema>,
  ): Promise<UpdateResult | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.updateOne(filter, update);
      return result;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }

  public async updateDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
    update: UpdateFilter<Schema>,
  ): Promise<UpdateResult | Document | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.updateMany(filter, update);
      return result;
    } catch (e) {
      Logger.getInstance().error(e);
      return null;
    }
  }
}

export { Persitence as default };
