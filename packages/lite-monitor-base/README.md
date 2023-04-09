# @lite-monitor/base

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/npm/v/@lite-monitor/base" />
</p>

A basic event tracking library that provides maximum flexibility and complete event definition

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Related Efforts](#related-efforts)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

LiteMonitor started with a database online examination real-time monitoring system. During the development of the system, I found that I needed an event tracking library that could meet the following characteristics:

- Lightweight
- Low invasiveness
- Well defined
- Good compatibility

As a result, I built a JavaScript library and published it to npm. In February 2021, I started developing version 1.0 of the project.

## Installation

This library uses Node.js and its package manager. Please make sure they are installed locally.

```sh
$ npm install @lite-monitor/base
```

or

```sh
$ yarn add @lite-monitor/base
```

or

```sh
$ pnpm add @lite-monitor/base
```

## Usage

This library can be used in CommonJS project and ESM project. Please refer to the [Examples](#examples).

## Examples

### For Node.js

```typescript
import {
  Monitor,
  type ErrorEvent,
  type MonitorFetcher,
  type PublicAttrArch,
  type PublicAttrOrientation,
  type PublicAttrOs,
  type PublicAttrPlatform,
  type PublicAttrType,
} from '@lite-monitor/base';
import http from 'http';
import https from 'https';
import os from 'os';

// Initialize
const fetcher: MonitorFetcher = (method, url, type, body) => {
  return new Promise((resolve, reject) => {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      reject(new Error('bad url'));
    } else {
      const nodeModule = url.protocol === 'http:' ? http : https;
      const options = { method, headers: type ? { 'Content-Type': type } : {} };
      const request = nodeModule.request(url, options, (res) =>
        resolve(res.statusMessage || ''),
      );
      request.on('error', (err) => reject(err));
      request.write(body);
      request.end();
    }
  });
};
const monitor = new Monitor(fetcher);

// Report error event
const { name, message, stack } = new Error();
const event: ErrorEvent = {
  type: PublicAttrType.ERROR,
  core: os.cpus().length,
  memory: os.totalmem() / (1 << 30),
  platform: PublicAttrPlatform.NODE,
  platformVersion: process.version.substring(1),
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

### For web browsers

```typescript
import {
  Monitor,
  type ErrorEvent,
  type MonitorFetcher,
  type PublicAttrArch,
  type PublicAttrOrientation,
  type PublicAttrOs,
  type PublicAttrPlatform,
  type PublicAttrType,
} from '@lite-monitor/base';

// Initialize
const fetcher: MonitorFetcher = (method, url, type, body) => {
  return new Promise((resolve, reject) => {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      reject(new Error('bad url'));
    } else {
      const options: RequestInit = {
        method,
        headers: type ? { 'Content-Type': type } : {},
        body,
        mode: 'cors',
      };
      globalThis
        .fetch(url.href, options)
        .then((res) => resolve(res.statusText))
        .catch((err) => reject(err));
    }
  });
};
const monitor = new Monitor(fetcher);

// Report error event
const { name, message, stack } = new Error();
const event: ErrorEvent = {
  type: PublicAttrType.ERROR,
  core: globalThis.navigator.hardwareConcurrency || 0,
  memory:
    (globalThis.navigator as Navigator & { deviceMemory: number })
      .deviceMemory || 0,
  platform: PublicAttrPlatform.UNKNOWN,
  platformVersion: '',
  os: PublicAttrOs.UNKNOWN,
  osVersion: '',
  arch: PublicAttrArch.UNKNOWN,
  orientation: PublicAttrOrientation.UNKNOWN,
  screenResolution: [
    globalThis.screen?.width || 0,
    globalThis.screen?.height || 0,
  ],
  windowResolution: [globalThis?.innerWidth || 0, globalThis?.innerHeight || 0],
  name,
  message,
  stack: stack?.split('\n    at ').slice(1) || [],
};
monitor.report([event]);
```

## Related Efforts

- [@lite-monitor/node](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-node)
- [@lite-monitor/web](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-web)

## Maintainers

[@peidongxie](https://github.com/peidongxie)

## Contributing

Feel free to open an [issue](https://github.com/peidongxie/lite-monitor/issues/new) or [PR](https://github.com/peidongxie/lite-monitor/compare).

## License

MIT © 谢沛东
