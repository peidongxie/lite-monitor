import { type Middleware } from 'koa';
import { NodeMonitor, type MonitorConfig } from './monitor';

/**
 * Type(s) related to the Koa monitor
 */

class KoaMonitor extends NodeMonitor {
  constructor(config?: MonitorConfig) {
    super(config);
    process.on('uncaughtException', (error) => {
      globalThis.console.error(error);
      this.reportError(error).then(() => {
        if (process.listenerCount('uncaughtException') === 1) process.exit();
      });
    });
  }

  middleware: Middleware = (context, next) => {
    context.state.monitor = this;
    return next()
      .catch((e) => {
        this.reportError(e);
        throw e;
      })
      .finally(() => {
        this.reportMessage(context.req, context.status);
      });
  };
}

export { KoaMonitor };
