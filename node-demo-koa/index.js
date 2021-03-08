const Koa = require('koa');
const Router = require('@koa/router');
const { koaMonitor, MonitorConfigProtocol } = require('@lite-monitor/node');

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003002',
};

const router = new Router();
router.get('/error', (ctx) => {
  this(ctx);
});
router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

const app = new Koa();
app.use(koaMonitor(config));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3002);
