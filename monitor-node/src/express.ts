import { ErrorRequestHandler } from 'express';
import { MonitorConfig, NodeMonitor } from './monitor';

export interface ExpressMonitorLocals {
  monitor: NodeMonitor;
}

export const expressMonitor = (config: MonitorConfig): ErrorRequestHandler => {
  const monitor = new NodeMonitor(config);
  process.on('uncaughtException', (error) => {
    console.log(error);
    monitor.reportError(error).then(() => {
      if (process.listenerCount('uncaughtException') === 1) process.exit();
    });
  });
  return (error, req, res, next) => {
    req.app.locals.monitor = monitor;
    monitor.reportError(error);
    next(error);
  };
};
