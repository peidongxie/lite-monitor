# @lite-monitor/web

`Lite Monitor` is a event tracking library for Node.js and Web, including:

- `@lite-monitor/base`: A base library for maximum flexibility and complete event definition
- `@lite-monitor/node`: A library for Node.js, including additional support for Express.js and Koa.js
- `@lite-monitor/web`: A library for Web, including additional support for React.js

## Features

- Lightweight
- Low invasiveness
- Well defined
- Good compatibility

## Examples

```typescript
import { MonitorConfigProtocol, WebMonitor } from '@lite-monitor/web';
const monitor = new WebMonitor({
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
}); // Initialization
monitor.reportError(new Error()); // Error Event Reporting
```

For React.js examples, please refer to the `Lite Monitor` repository.
