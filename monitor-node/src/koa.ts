import { Middleware } from 'koa';
import { Monitor, MonitorConfig } from './monitor';

interface KoaMonitorState {
  monitor: Monitor;
}

type KoaMonitorContext = Record<string, never>;

const koaMonitor = (
  config: MonitorConfig,
): Middleware<KoaMonitorState, KoaMonitorContext> => {
  const monitor = new Monitor(config);
  process.on('uncaughtException', (error) => {
    console.log(error);
    monitor.reportError(error).then(() => {
      if (process.listenerCount('uncaughtException') === 1) process.exit();
    });
  });
  return async (context, next) => {
    context.state.monitor = monitor;
    try {
      await next();
    } catch (error) {
      monitor.reportError(error);
      throw error;
    }
  };
};

export { KoaMonitorContext, KoaMonitorState, koaMonitor };
