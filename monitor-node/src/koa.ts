import { Middleware } from 'koa';
import { MonitorConfig, NodeMonitor } from './monitor';

export interface KoaMonitorState {
  monitor: NodeMonitor;
}

export type KoaMonitorContext = Record<string, never>;

export const koaMonitor = (
  config: MonitorConfig,
): Middleware<KoaMonitorState, KoaMonitorContext> => {
  const monitor = new NodeMonitor(config);
  process.on('uncaughtException', (error) => {
    console.error(error);
    monitor.reportError(error).then(() => {
      if (process.listenerCount('uncaughtException') === 1) process.exit();
    });
  });
  return async (context, next) => {
    context.state.monitor = monitor;
    try {
      await next();
    } catch (error) {
      monitor.reportError(error).finally();
      throw error;
    }
  };
};
