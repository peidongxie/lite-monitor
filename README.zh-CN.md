# Lite Monitor

适用于 Node.js 和 Web 的数据埋点库

开发者总是希望能够获取软件运行时信息以便帮助他们进行迭代，而数据埋点有助于更好地采集和分析运行时数据。一个优秀的数据埋点库可以让这一切变得更加简单。

本仓库包含以下内容：

- 一个基础的数据埋点库，提供最大的灵活性和完整的事件定义
- 一个针对 Node.js 的数据埋点库，包含对 Express.js 和 Koa.js 的额外支持
- 一个针对 Web 的数据埋点库，包含对 React.js 的额外支持
- 三个使用数据埋点库的最小工作示例，包括 Express.js 示例、Koa.js 示例和 React.js 示例
- 一个处理数据埋点所得数据的软件系统，包括完整的前后端

## 内容列表

- [背景](#背景)
- [安装](#安装)
- [使用](#使用)
- [维护者](#维护者)
- [使用许可](#使用许可)

## 背景

`Lite Monitor` 始于一个数据库在线考试实时监控系统。在开发该系统的过程中，我需要一个能够满足以下特性的数据埋点库：

- 轻量级
- 低侵入性
- 定义良好
- 兼容优秀

于是，数据埋点的部分作为一个独立模块从原项目中分离出来，成为了一个 JavaScript 库。

## 安装

本项目使用 [Node.js](https://nodejs.org) 和它的包管理器。请确保本地安装了它们。

```sh
$ npm install @lite-monitor/base
$ npm install @lite-monitor/node
$ npm install @lite-monitor/web
```

或者

```sh
$ yarn add @lite-monitor/base
$ yarn add @lite-monitor/node
$ yarn add @lite-monitor/web
```

通常你只需要输入其中一条指令。

## 使用

本项目提供了一些最小工作示例作为数据埋点的使用参考。

```sh
$ yarn start:express # 启动 Express.js 示例
$ yarn start:koa # 启动 Koa.js 示例
$ yarn start:react # 启动 React.js 示例
```

本项目还提供了一个完整的软件系统作为数据处理的使用参考。

```sh
$ yarn start
```

## 维护者

[@谢沛东](https://github.com/peidongxie)

## 使用许可

[MIT](LICENSE) © 谢沛东
