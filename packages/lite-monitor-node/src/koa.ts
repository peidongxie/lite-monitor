import { Middleware } from 'koa';
import { MonitorConfig, NodeMonitor } from './monitor';

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
    let error: Error | null = null;
    try {
      await next();
    } catch (e) {
      error = e;
    }
    if (error) this.reportError(error).finally();
    this.reportMessage(context.req, context.status).finally();
    if (error) throw error;
  };
}
