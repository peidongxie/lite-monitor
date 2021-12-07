import type { Middleware } from 'koa';
import { NodeMonitor } from './monitor';
import type { MonitorConfig } from './monitor';

/**
 * Type(s) related to the Koa monitor
 */

class KoaMonitor extends NodeMonitor {
  constructor(config?: Partial<MonitorConfig>) {
    super(config);
    process.on('uncaughtException', (error) => {
      console.error(error);
      this.reportError(error).then(() => {
        if (process.listenerCount('uncaughtException') === 1) process.exit();
      });
    });
  }

  middleware: Middleware = async (context, next) => {
    context.state.monitor = this;
    const errors = [];
    try {
      await next();
    } catch (e) {
      errors.push(e);
    }
    if (errors.length) this.reportError(errors[0]);
    this.reportMessage(context.req, context.status);
    if (errors.length) throw errors[0];
  };
}

export { KoaMonitor };
