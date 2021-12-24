# @lite-monitor/node

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/npm/v/@lite-monitor/node" />
</p>

A event tracking library for Node.js

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

LiteMonitor started with a database online examination real-time monitoring system. During the development of the system, I found that I needed a event tracking library that could meet the following characteristics:

- Lightweight
- Low invasiveness
- Well defined
- Good compatibility

As a result, I built a JavaScript library and published it to npm. In February 2021, I started developing version 1.0 of the project.

## Installation

This library uses Node.js and its package manager. Please make sure they are installed locally.

```sh
$ npm install @lite-monitor/node
```

or

```sh
$ yarn add @lite-monitor/node
```

or

```sh
$ pnpm add @lite-monitor/node
```

## Usage

This library can be used in CommonJS project and ESM project. Please refer to the [Examples](#examples).

## Examples

### For Node.js

```typescript
import { NodeMonitor } from '@lite-monitor/node';

// Initialize
const monitor = new NodeMonitor();

// Report error event
const error = new Error();
monitor.reportError(error);
```

### For Express

Please refer to the [Express Demo](https://github.com/peidongxie/lite-monitor/tree/main/packages/node-express-demo).

### For Koa

Please refer to the [Koa Demo](https://github.com/peidongxie/lite-monitor/tree/main/packages/node-koa-demo).

## Related Efforts

- [@lite-monitor/base](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-base)
- [@lite-monitor/web](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-web)
- [Express](https://github.com/expressjs/express)
- [Koa](https://github.com/koajs/koa)

## Maintainers

[@peidongxie](https://github.com/peidongxie)

## Contributing

Feel free to open an [issue](https://github.com/peidongxie/lite-monitor/issues/new) or [PR](https://github.com/peidongxie/lite-monitor/compare).

## License

MIT © 谢沛东
