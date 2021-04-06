# @lite-monitor/base

`Lite Monitor` is a event tracking library for Node.js and Web，including：

- `@lite-monitor/base`: A base library for maximum flexibility and complete event definition
- `@lite-monitor/node`: A library for Node.js, including additional support for Express.js and Koa.js
- `@lite-monitor/web`: A library for Web, including additional support for React.js

## Features

- Lightweight
- Low invasiveness
- Well defined
- Good compatibility

## Examples

### Node.js

```typescript
import http from 'http';
import {
  AttrArch,
  AttrOs,
  AttrPlatform,
  AttrType,
  ErrorEvent,
  Monitor,
  MonitorConfig,
  MonitorConfigProtocol,
  MonitorReporter,
  AttrOrientation,
} from '@lite-monitor/base';
import os from 'os';
const config: MonitorConfig = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
};
const reporter: MonitorReporter = (url, method, contentType, body) => {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http')) reject(new Error('bad url'));
    const nodeModule = http;
    const options = { method, headers: { 'Content-Type': contentType } };
    const request = nodeModule.request(url, options, () => resolve());
    request.on('error', (err) => reject(err));
    request.write(body);
    request.end();
  });
};
const monitor = new Monitor(config, reporter); // Initialization
const { name, message, stack } = new Error();
const event: ErrorEvent = {
  type: AttrType.ERROR,
  timestamp: new Date().getTime(),
  token: '',
  user: os.hostname(),
  core: os.cpus().length,
  memory: os.totalmem() / (1 << 30),
  platform: AttrPlatform.NODE,
  platformVersion: process.version.substr(1),
  os: AttrOs.UNKNOWN,
  osVersion: os.release(),
  arch: AttrArch.UNKNOWN,
  orientation: AttrOrientation.UNKNOWN,
  screenResolution: [0, 0],
  windowResolution: [0, 0],
  name,
  message,
  stack: stack?.split('\n    at ').slice(1) || [],
};
monitor.report([event]); // Error Event Reporting
```

### Web

```typescript
import {
  AttrArch,
  AttrOs,
  AttrPlatform,
  AttrType,
  ErrorEvent,
  Monitor,
  MonitorConfig,
  MonitorConfigProtocol,
  MonitorReporter,
  AttrOrientation,
} from '@lite-monitor/base';
const config: MonitorConfig = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
};
const reporter: MonitorReporter = (url, method, contentType, body) => {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http')) reject(new Error('bad url'));
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': contentType },
      body,
      mode: 'cors',
    };
    fetch(url, options)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};
const monitor = new Monitor(config, reporter); // Initialization
const { name, message, stack } = new Error();
const event: ErrorEvent = {
  type: AttrType.ERROR,
  timestamp: new Date().getTime(),
  token: '',
  user: '',
  core: navigator.hardwareConcurrency,
  memory: (navigator as Navigator & { deviceMemory: number }).deviceMemory,
  platform: AttrPlatform.UNKNOWN,
  platformVersion: '',
  os: AttrOs.UNKNOWN,
  osVersion: '',
  arch: AttrArch.UNKNOWN,
  orientation: AttrOrientation.UNKNOWN,
  screenResolution: [0, 0],
  windowResolution: [0, 0],
  name,
  message,
  stack: stack?.split('\n    at ').slice(1) || [],
};
monitor.report([event]); // Error Event Reporting
```
