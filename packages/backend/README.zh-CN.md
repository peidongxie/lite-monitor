# backend

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
</p>

处理数据埋点所得数据的软件系统后端

## 内容列表

- [背景](#背景)
- [安装](#安装)
- [使用](#使用)
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

本应用使用 Node.js 和 pnpm 工具。请确保本地安装了它们。

```sh
$ git clone https://github.com/peidongxie/lite-monitor
$ cd lite-monitor/packages/backend
$ pnpm install
```

## Usage

本应用可以以生产模式或开发模式启动。

对于生产模式：

```sh
$ pnpm build
$ pnpm start
```

对于开发模式：

```sh
$ pnpm dev
```

## 相关工作

- [@lite-monitor/base](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-base)
- [@lite-monitor/node](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-node)
- [@lite-monitor/web](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-web)
- [Fastify](https://github.com/fastify/fastify)
- [Pino](https://github.com/pinojs/pino)

## 维护者

[@peidongxie](https://github.com/peidongxie)

## 如何贡献

欢迎提 [issue](https://github.com/peidongxie/lite-monitor/issues/new) 或 [PR](https://github.com/peidongxie/lite-monitor/compare)。

## 使用许可

[MIT](../../LICENSE) © 谢沛东
