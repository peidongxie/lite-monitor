import { ErrorRequestHandler } from 'express';
import { Monitor, MonitorConfig } from './monitor';

interface ExpressMonitorLocals {
  monitor: Monitor;
}

const expressMonitor = (config: MonitorConfig): ErrorRequestHandler => {
  const monitor = new Monitor(config);
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

export { ExpressMonitorLocals, expressMonitor };
