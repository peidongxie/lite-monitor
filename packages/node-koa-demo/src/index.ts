import Router from '@koa/router';
import { KoaMonitor, ResourceAction } from '@lite-monitor/node';
import cluster from 'cluster';
import Koa from 'koa';
import os from 'os';

// Configure the Koa monitor
const config = {
  url: {
    events: 'http://localhost:3001/events',
    uuid: 'http://localhost:3001/uuid',
  },
  token: '0000000000003003',
};
const monitor = new KoaMonitor(config);

if (!cluster.isWorker) {
  const count = Math.max(2, os.cpus().length);
  for (let i = 0; i < count; i++) {
    cluster.fork();
  }
  // Report resource events
  cluster.on('online', (worker) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.CREATE },
    ]);
  });
  // Report resource events
  cluster.on('listening', (worker) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.START },
    ]);
  });
  // Report resource events
  cluster.on('message', (worker, message) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.CONSUME, payload: 'message:' + message },
    ]);
    worker.send(`Hello Worker${worker.id}!`);
  });
  // Report resource events
  cluster.on('exit', (worker) => {
    monitor.reportResource('worker' + worker.id, [
      { action: ResourceAction.STOP },
      { action: ResourceAction.DESTROY },
    ]);
    cluster.fork();
  });
} else {
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
  router.get('/resource/message', (ctx) => {
    ctx.body = 'Message Resource';
    cluster.worker?.send('Hello Master!');
  });
  router.get('/resource/disconnect', (ctx) => {
    ctx.body = 'Disconnect Resource';
    cluster.worker?.disconnect();
  });
  router.get('/', (ctx) => {
    ctx.body = 'Hello World!';
  });
  const app = new Koa();
  // Report error events and message events
  app.use(monitor.middleware);
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(3003);
  // Report resource events
  cluster.worker?.on('message', (message) => {
    monitor.reportResource('worker' + cluster.worker?.id, [
      { action: ResourceAction.PRODUCE, payload: 'message:' + message },
    ]);
  });
}
