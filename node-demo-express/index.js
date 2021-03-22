const express = require('express');
const { ExpressMonitor, MonitorConfigProtocol } = require('@lite-monitor/node');

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003001',
};
const monitor = new ExpressMonitor(config);

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
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.all('*', monitor.defaultRouterHandler);
app.use(monitor.errorRequestHandler);
app.listen(3001);
