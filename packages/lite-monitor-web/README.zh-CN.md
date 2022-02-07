# @lite-monitor/web

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/npm/v/@lite-monitor/web" />
</p>

适用于网络浏览器的数据埋点库

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
$ npm install @lite-monitor/web
```

或者

```sh
$ yarn add @lite-monitor/web
```

或者

```sh
$ pnpm add @lite-monitor/web
```

## 使用

本库可以在 CommonJS 项目和 ESM 项目中使用。请参考[示例](#示例)。

## 示例

### 对于网络浏览器

```typescript
import { WebMonitor } from '@lite-monitor/web';

// 初始化
const monitor = new WebMonitor();

// 上报错误事件
const error = new Error();
monitor.reportError(error);
```

### 对于 React

请参考 [React 示例](https://github.com/peidongxie/lite-monitor/tree/main/packages/web-react-demo)。

## 相关工作

- [@lite-monitor/base](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-base)
- [@lite-monitor/node](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-node)
- [React](https://github.com/facebook/react)
- [UAParser.js](https://github.com/faisalman/ua-parser-js)

## 维护者

[@peidongxie](https://github.com/peidongxie)

## 如何贡献

欢迎提 [issue](https://github.com/peidongxie/lite-monitor/issues/new) 或 [PR](https://github.com/peidongxie/lite-monitor/compare)。

## 使用许可

MIT © 谢沛东
