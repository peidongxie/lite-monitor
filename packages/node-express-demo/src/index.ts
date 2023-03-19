import { ExpressMonitor, ResourceAction } from '@lite-monitor/node';
import cluster from 'cluster';
import express from 'express';
import os from 'os';

// Configure the Express monitor
const config = {
  url: {
    events: 'http://localhost:3001/events',
    uuid: 'http://localhost:3001/uuid',
  },
  token: '0000000000003002',
};
const monitor = new ExpressMonitor(config);

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
  const app = express();
  // Report message events
  app.use(monitor.requestHandler);
  app.get('/error/common-error', (req, res) => {
    res.end('Common Error');
    message.toString();
  });
  app.get('/error/uncaught-exception', (req, res) => {
    res.end('Uncaught Exception');
    setTimeout(() => message.toString());
  });
  app.get('/error/unhandled-rejection', (req, res) => {
    res.end('Unhandled Rejection');
    Promise.resolve().then(() => message.toString());
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
  // Respond with status code 404 by default
  // Ensure message events are generated correctly
  app.all('*', monitor.defaultRouterHandler);
  // Report error events
  app.use(monitor.errorRequestHandler);
  app.listen(3002);
  // Report resource events
  cluster.worker?.on('message', (message) => {
    monitor.reportResource('worker' + cluster.worker?.id, [
      { action: ResourceAction.PRODUCE, payload: 'message:' + message },
    ]);
  });
}
