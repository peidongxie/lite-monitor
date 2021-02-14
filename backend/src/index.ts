import { addProject, findProject } from './controller/project';
import { findRecord } from './controller/record';
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
    controllers: [findRecord, null, null, null],
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
