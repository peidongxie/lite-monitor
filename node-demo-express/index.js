const express = require('express');
const { expressMonitor, MonitorConfigProtocol } = require('@lite-monitor/node');

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003001',
};

const app = express();
app.get('/error', (req, res) => {
  console.log(this());
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(expressMonitor(config));
app.listen(3001);
