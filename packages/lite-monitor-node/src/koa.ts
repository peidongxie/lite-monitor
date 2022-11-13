import { type Middleware } from 'koa';
import { NodeMonitor, type MonitorConfig } from './monitor';

/**
 * Type(s) related to the Koa monitor
 */

class KoaMonitor extends NodeMonitor {
  constructor(config?: MonitorConfig) {
    super(config);
    this.globalErrorCatch();
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
