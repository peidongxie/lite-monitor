const cluster = require('cluster');
const Koa = require('koa');
const os = require('os');
const Router = require('@koa/router');
const {
  KoaMonitor,
  MonitorConfigProtocol,
  ResourceAction,
} = require('@lite-monitor/node');

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003002',
};
const monitor = new KoaMonitor(config);

if (cluster.isMaster) {
  const count = Math.max(2, os.cpus().length);
  for (let i = 0; i < count; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.CREATE },
    ]);
  });
  cluster.on('listening', (worker) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.START },
    ]);
  });
  cluster.on('message', (worker, message) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.CONSUME, payload: 'message:' + message },
    ]);
    worker.send(`Hello Worker${worker.id}!`);
  });
  cluster.on('exit', (worker) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.STOP },
      { action: ResourceAction.DESTROY },
    ]);
    cluster.fork();
  });
}

if (cluster.isWorker) {
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
  router.get('/disconnect', (ctx) => {
    ctx.body = 'Disconnect';
    cluster.worker.disconnect();
  });
  router.get('/', (ctx) => {
    ctx.body = 'Hello World!';
    cluster.worker.send('Hello Master!');
  });
  const app = new Koa();
  app.use(monitor.middleware);
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(3002);
  cluster.worker.on('message', (message) => {
    monitor.reportResource('worker' + cluster.worker.id, [
      { action: ResourceAction.PRODUCE, payload: 'message:' + message },
    ]);
  });
}
