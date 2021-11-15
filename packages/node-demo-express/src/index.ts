import cluster from 'cluster';
import express from 'express';
import os from 'os';
import {
  ExpressMonitor,
  MonitorConfigProtocol,
  ResourceAction,
} from '@lite-monitor/node';

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3001,
  initToken: '0000000000003002',
};
const monitor = new ExpressMonitor(config);

if (!cluster.isWorker) {
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
} else {
  const messages = ['Hello World!'];
  const message = messages[1];
  const app = express();
  app.use(monitor.requestHandler);
  app.get('/error/sync', (req, res) => {
    res.end('Sync Error');
    message.toLowerCase();
  });
  app.get('/error/async', (req, res) => {
    res.end('Async Error');
    Promise.resolve().then(() => message.toUpperCase());
  });
  app.get('/resource/message', (req, res) => {
    res.end('Message Resource');
    cluster.worker?.send('Hello Master!');
  });
  app.get('/resource/disconnect', (req, res) => {
    res.end('Disconnect Resource');
    cluster.worker?.disconnect();
  });
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  app.all('*', monitor.defaultRouterHandler);
  app.use(monitor.errorRequestHandler);
  app.listen(3002);
  cluster.worker?.on('message', (message) => {
    monitor.reportResource('worker' + cluster.worker?.id, [
      { action: ResourceAction.PRODUCE, payload: 'message:' + message },
    ]);
  });
}
