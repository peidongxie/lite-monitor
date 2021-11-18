import type {
  FastifyMongoNestedObject,
  FastifyMongoObject,
} from 'fastify-mongodb';
import type {
  Collection,
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
import type App from '../app';

class Persitence {
  #app: App;
  #value: FastifyMongoObject & FastifyMongoNestedObject;

  constructor(app: App) {
    this.#app = app;
    this.#value = app.getServer().getPersitenceValue();
  }

  async createCollection<Schema extends BaseSchema>(
    name: string,
  ): Promise<Collection<Schema> | null> {
    const logger = this.#app.getLogger();
    const db = this.#value.db;
    if (!db) return null;
    try {
      const collection = await db.createCollection<Schema>(name);
      return collection;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  retrieveCollection<Schema extends BaseSchema>(
    name: string,
  ): Collection<Schema> | null {
    const logger = this.#app.getLogger();
    const db = this.#value.db;
    if (!db) return null;
    try {
      const collection = db.collection<Schema>(name);
      return collection;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async createDocument<Schema extends BaseSchema>(
    name: string,
    doc: OptionalId<Schema>,
  ): Promise<InsertOneResult<Schema> | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.insertOne(doc);
      return result;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async createDocuments<Schema extends BaseSchema>(
    name: string,
    docs: OptionalId<Schema>[],
  ): Promise<InsertManyResult<Schema> | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.insertMany(docs);
      return result;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async deleteDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<DeleteResult | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.deleteOne(filter);
      return result;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async deleteDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<DeleteResult | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.deleteMany(filter);
      return result;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async retrieveDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<Schema | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const document = await collection.findOne(filter);
      return document;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async retrieveDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
  ): Promise<Schema[] | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const cursor = await collection.find(filter);
      const documents = await cursor.toArray();
      return documents;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async updateDocument<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
    update: UpdateFilter<Schema>,
  ): Promise<UpdateResult | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.updateOne(filter, update);
      return result;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async updateDocuments<Schema extends BaseSchema>(
    name: string,
    filter: Filter<Schema>,
    update: UpdateFilter<Schema>,
  ): Promise<UpdateResult | Document | null> {
    const logger = this.#app.getLogger();
    const collection = this.retrieveCollection<Schema>(name);
    if (!collection) return null;
    try {
      const result = await collection.updateMany(filter, update);
      return result;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
}

export default Persitence;
