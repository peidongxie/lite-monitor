# Lite Monitor

A event tracking library for Node.js and Web

Developers always want to have access to software runtime information to help them iterate, and event tracking help to better capture and analyze runtime data. A good event tracking library can make this much easier.

This repository contains:

- A basic event tracking library that provides maximum flexibility and complete event definition
- A event tracking library for Node.js, including additional support for Express.js and Koa.js
- A event tracking library for Web, including additional support for React.js
- Some minimal working examples using the event tracking library, including an Express.js example, a Koa.js example, and a React.js example
- A software system for processing data from event tracking, including a complete front-end and back-end

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [Maintainer](#maintainer)
- [License](#license)

## Background

`Lite Monitor` started with a database online examination real-time monitoring system. During the development of the system, I needed a event tracking library that could meet the following characteristics:

- Lightweight
- Low invasiveness
- Well defined
- Good compatibility

As a result, the part of event tracking was separated from the original project as a separate module and became a JavaScript library.

## Installation

This project uses [Node.js](https://nodejs.org) and its package manager. Please make sure they are installed locally.

```sh
$ npm install @lite-monitor/base
$ npm install @lite-monitor/node
$ npm install @lite-monitor/web
```

or

```sh
$ yarn add @lite-monitor/base
$ yarn add @lite-monitor/node
$ yarn add @lite-monitor/web
```

Usually you only need to execute one of these commands.

## Usage

This project provides some minimal working examples as a reference for the use of event tracking.

```sh
$ yarn start:express # Launch the Express.js demo
$ yarn start:koa # Launch the Koa.js demo
$ yarn start:react # Launch the React.js demo
```

This project also provides a complete software system as a reference for the use of data processing.

```sh
$ yarn start
```

## Maintainer

[@谢沛东](https://github.com/peidongxie)

## License

[MIT](LICENSE) © Peidong Xie
