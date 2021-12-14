# LiteMonitor

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
</p>

适用于 Node.js 和网络浏览器的数据埋点库

开发者总是希望能够获取软件运行时信息以便帮助他们进行迭代，而数据埋点有助于更好地采集和分析运行时数据。一个优秀的数据埋点库可以让这一切变得更加简单。

本项目包含以下内容：

- 基础的数据埋点库，提供最大的灵活性和完整的事件定义
- 适用于 Node.js 的数据埋点库，包含对 Express 和 Koa 的额外支持
- 适用于网络浏览器的数据埋点库，包含对 React 的额外支持
- 一些使用数据埋点库的工作示例，包括 Express 示例、Koa 示例和 React 示例
- 处理数据埋点所得数据的软件系统，包括前端和后端

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

### 数据埋点库

它使用 Node.js 和它的包管理器。请确保本地安装了它们。

```sh
$ npm install @lite-monitor/base
```

或者

```sh
$ yarn add @lite-monitor/base
```

要获得对 Node.js 的更多支持：

```sh
$ npm install @lite-monitor/node
```

或者

```sh
$ yarn add @lite-monitor/node
```

要获得对网络浏览器的更多支持：

```sh
$ npm install @lite-monitor/web
```

或者

```sh
$ yarn add @lite-monitor/web
```

### 处理数据埋点所得数据的软件系统

它使用 Node.js 和它的包管理器。请确保本地安装了它们。

```sh
$ git clone https://github.com/peidongxie/lite-monitor
$ cd lite-monitor
$ npm install
```

或者

```sh
$ git clone https://github.com/peidongxie/lite-monitor
$ cd lite-monitor
$ yarn
```

## 使用

### 数据埋点库

它可以在 CommonJS 项目和 ESM 项目中使用。请参考[示例](#示例)。

### 处理数据埋点所得数据的软件系统

它可以以生产模式或开发模式启动。

对于生产模式：

```sh
$ npm run build:app
$ npm run start:app
```

or

```sh
$ yarn build:app
$ yarn start:app
```

对于开发模式：

```sh
$ npm run dev:app
```

或者

```sh
$ yarn dev:app
```

## 示例

本项目提供一些使用数据埋点库的工作示例。

- [Express 示例](./packages/node-express-demo)
- [Koa 示例](./packages/node-koa-demo)
- [React 示例](./packages/web-react-demo)

## 相关工作

- [Express](https://github.com/expressjs/express)
- [Koa](https://github.com/koajs/koa)
- [React](https://github.com/facebook/react)
- [UAParser.js](https://github.com/faisalman/ua-parser-js)

## 维护者

[@peidongxie](https://github.com/peidongxie)

## 如何贡献

欢迎提 [issue](https://github.com/peidongxie/lite-monitor/issues/new) 或 [PR](https://github.com/peidongxie/lite-monitor/compare).

## 使用许可

[MIT](LICENSE) © 谢沛东
