# LiteMonitor

<p align="center">
  <img src="./packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
</p>

A event tracking library for Node.js and web browser

Developers always want to have access to software runtime information to help them iterate, and event tracking help to better capture and analyze runtime data. A good event tracking library can make this much easier.

This project contains:

- A basic event tracking library that provides maximum flexibility and complete event definition
- A event tracking library for Node.js, including additional support for Express and Koa
- A event tracking library for web browser, including additional support for React
- Some working examples using the event tracking library, including an Express example, a Koa example, and a React example
- A software system for processing data from event tracking, including a front-end and a back-end

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

### The event tracking library

It uses Node.js and its package manager. Please make sure they are installed locally.

```sh
$ npm install @lite-monitor/base
```

or

```sh
$ yarn add @lite-monitor/base
```

For more support for Node.js:

```sh
$ npm install @lite-monitor/node
```

or

```sh
$ yarn add @lite-monitor/node
```

For more support for web browser:

```sh
$ npm install @lite-monitor/web
```

or

```sh
$ yarn add @lite-monitor/web
```

### The software system for processing data from event tracking

It uses Node.js and its package manager. Please make sure they are installed locally.

```sh
$ git clone https://github.com/peidongxie/lite-monitor
$ cd lite-monitor
$ npm install
```

or

```sh
$ git clone https://github.com/peidongxie/lite-monitor
$ cd lite-monitor
$ yarn
```

## Usage

### The event tracking library

It can be used in CommonJS project and ESM project. Please refer to the [Examples](#examples).

### The software system for processing data from event tracking

It can be started in production mode or development mode.

For production mode:

```sh
$ npm run build:app
$ npm run start:app
```

or

```sh
$ yarn build:app
$ yarn start:app
```

For development mode:

```sh
$ npm run dev:app
```

or

```sh
$ yarn dev:app
```

## Examples

Some working examples using the event tracking library are provided for this project.

- [Express Demo](./packages/node-express-demo)
- [Koa Demo](./packages/node-koa-demo)
- [React Demo](./packages/web-react-demo)

## Related Efforts

- [Express](https://github.com/expressjs/express)
- [Koa](https://github.com/koajs/koa)
- [React](https://github.com/facebook/react)
- [UAParser.js](https://github.com/faisalman/ua-parser-js)

## Maintainers

[@peidongxie](https://github.com/peidongxie)

## Contributing

Feel free to open an [issue](https://github.com/peidongxie/lite-monitor/issues/new) or [PR](https://github.com/peidongxie/lite-monitor/compare).

## License

[MIT](LICENSE) © 谢沛东
