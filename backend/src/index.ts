import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import { addRecord, findRecord, removeRecord } from './controller/record';

const app = new Koa();
const router = new Router();

router.get('/record', findRecord);
router.post('/record', addRecord);
router.delete('/record', removeRecord);

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
