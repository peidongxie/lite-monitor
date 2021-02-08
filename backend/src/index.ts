import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import { addRecord, findRecord, removeRecord } from './controller/record';
import { getMiddleware } from './util/db';
import { info } from './util/log';
import { ContextState } from './util/types';

const router = new Router<ContextState>();
router.get('/record', findRecord);
router.post('/record', addRecord);
router.delete('/record', removeRecord);

const app = new Koa<ContextState>();
app.use(getMiddleware());
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

info('Service is listening on port 3000.');
