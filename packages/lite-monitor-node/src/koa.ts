import type { Middleware } from 'koa';
import { NodeMonitor } from './monitor';
import type { MonitorConfig } from './monitor';

export interface KoaMonitorState {
  monitor: NodeMonitor;
}

export type KoaMonitorContext = Record<string, never>;

export class KoaMonitor extends NodeMonitor {
  constructor(config: MonitorConfig) {
    super(config);
    process.on('uncaughtException', (error) => {
      console.error(error);
      this.reportError(error).then(() => {
        if (process.listenerCount('uncaughtException') === 1) process.exit();
      });
    });
  }

  middleware: Middleware<KoaMonitorState, KoaMonitorContext> = async (
    context,
    next,
  ) => {
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
