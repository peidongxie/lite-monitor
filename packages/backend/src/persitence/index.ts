import type {
  FastifyMongoNestedObject,
  FastifyMongoObject,
} from 'fastify-mongodb';
import type {
  Collection,
  CollectionInfo,
  DeleteResult,
  Document,
  InsertManyResult,
  InsertOneResult,
  Filter,
  OptionalId,
  UpdateFilter,
  UpdateResult,
} from 'mongodb';
import type { BaseSchema } from '../type';
import type Logger from '../logger';
import type Server from '../server';

class Persitence {
  #logger: Logger;
  #value: FastifyMongoObject & FastifyMongoNestedObject;

  constructor(server: Server, logger: Logger) {
    this.#logger = logger;
    this.#value = server.getPersitenceValue();
  }

  collection<Schema extends BaseSchema>(
    name: string,
  ): Collection<Schema> | null {
    const db = this.#value.db;
    if (!db) return null;
    return db.collection<Schema>(name);
  }

  async createCollection<Schema extends BaseSchema>(
    name: string,
  ): Promise<Collection<Schema> | null> {
    const db = this.#value.db;
    if (!db) return null;
    try {
      const collection = await db.createCollection<Schema>(name);
      return collection;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async createDocument<Schema extends BaseSchema>(
    name: string,
    doc: OptionalId<Schema>,
  ): Promise<InsertOneResult<Schema> | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.insertOne(doc);
      return result;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async createDocuments<Schema extends BaseSchema>(
    name: string,
    docs: OptionalId<Schema>[],
  ): Promise<InsertManyResult<Schema> | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.insertMany(docs);
      return result;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async deleteCollection(name: string): Promise<boolean | null> {
    const db = this.#value.db;
    if (!db) return null;
    try {
      const collection = await db.dropCollection(name);
      return collection;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async deleteDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<DeleteResult | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.deleteOne(filter);
      return result;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async deleteDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<DeleteResult | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.deleteMany(filter);
      return result;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async retrieveCollections(
    filter: Document,
  ): Promise<Pick<CollectionInfo, 'name' | 'type'>[] | null> {
    const db = this.#value.db;
    if (!db) return null;
    try {
      const cursor = db.listCollections(filter);
      const collections = await cursor.toArray();
      return collections;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async retrieveDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<Schema | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const document = await collection.findOne(filter);
      return document;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async retrieveDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<Schema[] | null> {
    const collection = this.collection<Schema>(name);
    if (!collection) return null;
    try {
      const cursor = await collection.find(filter);
      const documents = await cursor.toArray();
      return documents;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async updateCollection<Schema extends BaseSchema>(
    fromCollection: string,
    toCollection: string,
  ): Promise<Collection<Schema> | null> {
    const db = this.#value.db;
    if (!db) return null;
    try {
      const collection = await db.renameCollection<Schema>(
        fromCollection,
        toCollection,
      );
      return collection;
    } catch (e) {
      this.#logger.error(e);
      return null;
    }
  }

  async updateDocument<Schema extends BaseSchema>(
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
      this.#logger.error(e);
      return null;
    }
  }

  async updateDocuments<Schema extends BaseSchema>(
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
      this.#logger.error(e);
      return null;
    }
  }
}

export default Persitence;
