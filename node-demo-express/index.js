const express = require('express');
const { Monitor, MonitorConfigProtocol } = require('@lite-monitor/node');

const app = express();
const port = 3001;
const monitor = new Monitor({
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(monitor.expressMiddleware());

app.listen(port);
