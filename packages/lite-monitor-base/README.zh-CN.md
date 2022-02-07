# @lite-monitor/base

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/npm/v/@lite-monitor/base" />
</p>

基础的数据埋点库，提供最大的灵活性和完整的事件定义

## 内容列表

- [背景](#背景)
- [安装](#安装)
- [使用](#使用)
- [示例](#示例)
- [相关工作](#相关工作)
- [维护者](#维护者)
- [如何贡献](#如何贡献)
- [使用许可](#使用许可)

## 背景

LiteMonitor 始于一个数据库在线考试实时监控系统。在开发该系统的过程中，我发现需要一个能够满足以下特性的数据埋点库：

- 轻量级
- 低侵入性
- 定义良好
- 兼容优秀

于是，我构建了一个 JavaScript 库并发布到 npm registry 上。2021 年 4 月，我开始开发项目的 1.0 版本。

## 安装

本库使用 Node.js 和它的包管理器。请确保本地安装了它们。

```sh
$ npm install @lite-monitor/base
```

或者

```sh
$ yarn add @lite-monitor/base
```

或者

```sh
$ pnpm add @lite-monitor/base
```

## 使用

本库可以在 CommonJS 项目和 ESM 项目中使用。请参考[示例](#示例)。

## 示例

### 对于 Node.js

```typescript
import {
  ErrorEvent,
  Monitor,
  MonitorReporter,
  PublicAttrArch,
  PublicAttrOrientation,
  PublicAttrOs,
  PublicAttrPlatform,
  PublicAttrType,
} from '@lite-monitor/base';
import http from 'http';
import https from 'https';
import os from 'os';

// 初始化
const reporter: MonitorReporter = (method, url, type, body) => {
  return new Promise((resolve, reject) => {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      reject(new Error('bad url'));
    } else {
      const nodeModule = url.protocol === 'http:' ? http : https;
      const options = { method, headers: { 'Content-Type': type } };
      const request = nodeModule.request(url, options, () => resolve());
      request.on('error', (err) => reject(err));
      request.write(body);
      request.end();
    }
  });
};
const monitor = new Monitor(reporter);

// 上报错误事件
const { name, message, stack } = new Error();
const event: ErrorEvent = {
  type: PublicAttrType.ERROR,
  core: os.cpus().length,
  memory: os.totalmem() / (1 << 30),
  platform: PublicAttrPlatform.NODE,
  platformVersion: process.version.substr(1),
  os: PublicAttrOs.UNKNOWN,
  osVersion: os.release(),
  arch: PublicAttrArch.UNKNOWN,
  orientation: PublicAttrOrientation.UNKNOWN,
  screenResolution: [0, 0],
  windowResolution: [0, 0],
  name,
  message,
  stack: stack?.split('\n    at ').slice(1) || [],
};
monitor.report([event]);
```

### 对于网络浏览器

```typescript
import {
  ErrorEvent,
  Monitor,
  MonitorReporter,
  PublicAttrArch,
  PublicAttrOrientation,
  PublicAttrOs,
  PublicAttrPlatform,
  PublicAttrType,
} from '@lite-monitor/base';

// 初始化
const reporter: MonitorReporter = (method, url, type, body) => {
  return new Promise((resolve, reject) => {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      reject(new Error('bad url'));
    } else {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': type },
        body,
        mode: 'cors',
      };
      fetch(url.href, options)
        .then(() => resolve())
        .catch((err) => reject(err));
    }
  });
};
const monitor = new Monitor(reporter);

// 上报错误事件
const { name, message, stack } = new Error();
const event: ErrorEvent = {
  type: PublicAttrType.ERROR,
  core: navigator.hardwareConcurrency || 0,
  memory: (navigator as Navigator & { deviceMemory: number }).deviceMemory || 0,
  platform: PublicAttrPlatform.UNKNOWN,
  platformVersion: '',
  os: PublicAttrOs.UNKNOWN,
  osVersion: '',
  arch: PublicAttrArch.UNKNOWN,
  orientation: PublicAttrOrientation.UNKNOWN,
  screenResolution: [screen?.width || 0, screen?.height || 0],
  windowResolution: [window?.innerWidth || 0, window?.innerHeight || 0],
  name,
  message,
  stack: stack?.split('\n    at ').slice(1) || [],
};
monitor.report([event]);
```

## 相关工作

- [@lite-monitor/node](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-node)
- [@lite-monitor/web](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-web)

## 维护者

[@peidongxie](https://github.com/peidongxie)

## 如何贡献

欢迎提 [issue](https://github.com/peidongxie/lite-monitor/issues/new) 或 [PR](https://github.com/peidongxie/lite-monitor/compare)。

## 使用许可

MIT © 谢沛东
