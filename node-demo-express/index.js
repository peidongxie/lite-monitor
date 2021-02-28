const express = require('express');
const { Monitor, MonitorConfigProtocol } = require('@lite-monitor/node');
const monitor = new Monitor({
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
});

monitor.token = '3001300130013001';

const app = express();

app.get('/error', (req, res) => {
  console.log(this());
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(monitor.expressMiddleware());

app.listen(3001);
