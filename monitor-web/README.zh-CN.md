# @lite-monitor/web

`Lite Monitor` 是一个适用于 Node.js 和 Web 的数据埋点库，包括：

- `@lite-monitor/base`: 基础库，提供最大的灵活性和完整的事件定义
- `@lite-monitor/node`: 针对 Node.js 的库，包含对 Express.js 和 Koa.js 的额外支持
- `@lite-monitor/web`: 针对 Web 的库，包含对 React.js 的额外支持

## Features

- 轻量级
- 低侵入性
- 定义良好
- 兼容优秀

## Examples

```typescript
import { MonitorConfigProtocol, WebMonitor } from '@lite-monitor/web';
const monitor = new WebMonitor({
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
}); // 初始化
monitor.reportError(new Error()); // 错误事件上报
```

React.js 示例请参考 `Lite Monitor` 仓库。
