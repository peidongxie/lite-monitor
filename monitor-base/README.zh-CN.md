# @lite-monitor/base

`Lite Monitor` 是一个适用于 Node.js 和 Web 的数据埋点库，包括：

- `@lite-monitor/base`: 基础库，提供最大的灵活性和完整的事件定义
- `@lite-monitor/node`: 针对 Node.js 的库，包含对 Express.js 和 Koa.js 的额外支持
- `@lite-monitor/web`: 针对 Web 的库，包含对 React.js 的额外支持

## 特性

- 轻量级
- 低侵入性
- 定义良好
- 兼容优秀

## 示例

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
const monitor = new Monitor(config, reporter); // 初始化
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
monitor.report([event]); // 错误事件上报
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
const monitor = new Monitor(config, reporter); // 初始化
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
monitor.report([event]); // 错误事件上报
```
