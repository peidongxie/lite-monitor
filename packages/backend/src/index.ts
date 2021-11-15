import * as project from './controller/project';
import * as record from './controller/record';
import { initDb } from './util/database';
import { error } from './util/logger';
import { initQueue } from './util/queue';
import { initRouter } from './util/router';
import { initServer, startServer } from './util/server';

try {
  await initDb();
  await initQueue();
  await initRouter({ project, record });
  await initServer();
  await startServer();
} catch (e) {
  error(e);
}
