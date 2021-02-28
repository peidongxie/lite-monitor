const Koa = require('koa');
const Router = require('@koa/router');
const { Monitor, MonitorConfigProtocol } = require('@lite-monitor/node');

const monitor = new Monitor({
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
});
monitor.token = '0000000000003002';

const router = new Router();
router.get('/error', (ctx) => {
  this(ctx);
});
router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

const app = new Koa();
app.use(monitor.koaMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3002);
