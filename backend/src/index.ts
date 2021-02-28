import { addProject, findProject } from './controller/project';
import { addRecord, findRecord } from './controller/record';
import { initDb } from './util/database';
import { error } from './util/log';
import { initRouter } from './util/router';
import { initServer, startServer } from './util/server';

const config = [
  {
    path: '/project',
    controllers: [findProject, addProject, null, null],
  },
  {
    path: '/record',
    controllers: [findRecord, addRecord, null, null],
  },
];

try {
  await initDb();
  await initRouter(config);
  await initServer();
  await startServer();
} catch (e) {
  error(e);
}
