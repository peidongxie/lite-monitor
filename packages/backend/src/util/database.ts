import {
  Collection,
  CreateCollectionOptions,
  Db,
  DeleteResult,
  Document,
  Filter,
  InsertManyResult,
  InsertOneResult,
  OptionalId,
  UpdateFilter,
  UpdateResult,
} from 'mongodb';
import { database } from '../app';
import {
  DEMO_PROJECTS,
  NAME,
  PROJECT_INFO,
  PROJECT_PREFIX,
} from '../config/database';
import { BaseSchema, ProjectSchema } from '../type/database';
import { error, info, warn } from './logger';

export const getDb = (): Db => database.db(NAME);

export const getCollection = <T extends BaseSchema>(
  name: string,
): Collection<T> => database.db(NAME).collection(name);

export const createCollection = async <T extends BaseSchema>(
  name: string,
  options: CreateCollectionOptions,
): Promise<Collection<T> | null> => {
  const db = getDb();
  try {
    const collection = await db.createCollection<T>(name, options);
    info(`Collection '${name}' is created.`);
    return collection;
  } catch (e) {
    error(`Failed to create collection '${name}'.`);
    error(e);
    return null;
  }
};

export const findDocument = async <T extends BaseSchema>(
  name: string,
  filter: Filter<T>,
): Promise<T[] | null> => {
  const collection = getCollection<T>(name);
  try {
    const result = await collection.find(filter).toArray();
    info(`Collection '${name}': Some documents are found.`);
    return result;
  } catch (e) {
    error(`Collection '${name}': Failed to find some documents.`);
    error(e);
    return null;
  }
};

export const addDocument = async <T extends BaseSchema>(
  name: string,
  data: OptionalId<T> | OptionalId<T>[],
): Promise<InsertManyResult<T> | InsertOneResult<T> | null> => {
  const collection = getCollection<T>(name);
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
    error(e);
    return null;
  }
};

export const removeDocument = async <T extends BaseSchema>(
  name: string,
  filter: Filter<T>,
): Promise<DeleteResult | null> => {
  const collection = getCollection<T>(name);
  try {
    const result = await collection.deleteMany(filter);
    info(`Collection '${name}': Some documents were deleted.`);
    return result;
  } catch (e) {
    error(`Collection '${name}': Failed to delete some documents.`);
    error(e);
    return null;
  }
};

export const changeDocument = async <T extends BaseSchema>(
  name: string,
  filter: Filter<T>,
  update: UpdateFilter<T>,
): Promise<UpdateResult | Document | null> => {
  const collection = getCollection<T>(name);
  try {
    const result = await collection.updateMany(filter, update);
    info(`Collection '${name}': Some documents were changed.`);
    return result;
  } catch (e) {
    error(`Collection '${name}': Failed to change some documents.`);
    error(e);
    return null;
  }
};

export const initDb = async (): Promise<void> => {
  // 连接
  await database.connect();
  info('Database is connected.');
  // 获取所有collection名称
  const db = getDb();
  const collections = await db.collections();
  const names = collections.map((collection) => collection.collectionName);
  // 创建项目信息的collection
  if (names.every((name) => name !== PROJECT_INFO)) {
    await createCollection(PROJECT_INFO, {});
  }
  // 增加示例项目信息
  const projects = await findDocument<ProjectSchema>(PROJECT_INFO, {});
  if (projects === null) return;
  for (const demo of DEMO_PROJECTS) {
    if (projects.every((project) => project.name !== demo.name)) {
      await addDocument<ProjectSchema>(PROJECT_INFO, demo);
    }
  }
  // 创建记录信息的collection
  const allProjects = await findDocument<ProjectSchema>(PROJECT_INFO, {});
  if (allProjects === null) return;
  for (const project of allProjects) {
    const s = PROJECT_PREFIX + project.name;
    if (names.every((name) => name !== s)) {
      await createCollection(s, {});
    }
  }
  info('Database is initialized.');
};