import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import { addRecord, findRecord, removeRecord } from './controller/record';
import { info } from './util/log';

const app = new Koa();
const router = new Router();

router.get('/record', findRecord);
router.post('/record', addRecord);
router.delete('/record', removeRecord);

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);

info('Server is running...');
