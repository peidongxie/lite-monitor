import Koa from 'koa';
import { MongoClient } from 'mongodb';
import cors from '@koa/cors';
import Router from '@koa/router';
import { PORT } from './config/app';
import { NAME } from './config/db';
import { addRecord, findRecord, removeRecord } from './controller/record';
import { ContextState, ProjectInfoSchema } from './type/app';
import { createCollection, findDocument, getMiddleware } from './util/db';
import { info } from './util/log';

const router = new Router<ContextState>();
router.get('/record', findRecord);
router.post('/record', addRecord);
router.delete('/record', removeRecord);

const initDatabase = async (client: MongoClient): Promise<void> => {
  // 获取所有collection名称
  const db = client.db(NAME);
  const collections = await db.collections();
  const names = collections.map((collection) => collection.collectionName);
  // 创建项目信息的collection和每一个项目对应的collection
  if (names.every((name) => name !== 'project_info')) {
    await createCollection(client, 'project_info');
  } else {
    const projects = await findDocument<ProjectInfoSchema>(
      client,
      'project_info',
    );
    if (projects === null) return;
    for (const project of projects) {
      const s = 'project_' + project._id.toHexString();
      if (names.every((name) => name !== s)) {
        await createCollection(client, s);
      }
    }
  }
  // todo
};

const app = new Koa<ContextState>();
app.use(getMiddleware(initDatabase));
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);

info(`Service is listening on port ${PORT}.`);
