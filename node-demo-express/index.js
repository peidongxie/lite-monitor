const childProcess = require('child_process');
const express = require('express');
const { expressMonitor, MonitorConfigProtocol } = require('@lite-monitor/node');

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003001',
};

const messages = ['Hello World!'];
const message = messages[1];

const app = express();
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
app.use(expressMonitor(config));
app.listen(3001);
