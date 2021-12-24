# backend

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
</p>

处理数据埋点所得数据的软件系统前端

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

本应用使用 Node.js 和它的包管理器。请确保本地安装了它们。

```sh
$ git clone https://github.com/peidongxie/lite-monitor
$ cd lite-monitor/packages/frontend
$ pnpm install
```

## Usage

本应用可以以生产模式或开发模式启动。

对于生产模式：

```sh
$ pnpm build
$ pnpm start
```

或者

对于开发模式：

```sh
$ pnpm run dev
```

## 相关工作

- [@lite-monitor/base](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-base)
- [@lite-monitor/node](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-node)
- [@lite-monitor/web](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-web)
- [Chart.js](https://github.com/chartjs/Chart.js)
- [Material-UI](https://github.com/mui-org/material-ui)
- [Next.js](https://github.com/vercel/next.js)
- [React](https://github.com/facebook/react)
- [SWR](https://github.com/vercel/swr)
- [clsx](https://github.com/lukeed/clsx)

## 维护者

[@peidongxie](https://github.com/peidongxie)

## 如何贡献

欢迎提 [issue](https://github.com/peidongxie/lite-monitor/issues/new) 或 [PR](https://github.com/peidongxie/lite-monitor/compare).

## 使用许可

[MIT](../../LICENSE) © 谢沛东
