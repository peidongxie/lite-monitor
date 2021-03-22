const Koa = require('koa');
const Router = require('@koa/router');
const { KoaMonitor, MonitorConfigProtocol } = require('@lite-monitor/node');

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003002',
};
const monitor = new KoaMonitor(config);

const messages = ['Hello World!'];
const message = messages[1];

const router = new Router();
router.get('/error/sync', (ctx) => {
  ctx.body = 'Sync Error';
  message.toLowerCase();
});
router.get('/error/async', (ctx) => {
  ctx.body = 'Async Error';
  Promise.resolve().then(() => message.toUpperCase());
});
router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

const app = new Koa();
app.use(monitor.middleware);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3002);
