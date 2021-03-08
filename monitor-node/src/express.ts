import { ErrorRequestHandler } from 'express';
import { Monitor, MonitorConfig } from './monitor';

interface ExpressMonitorLocals {
  monitor: Monitor;
}

const expressMonitor = (config: MonitorConfig): ErrorRequestHandler => {
  const monitor = new Monitor(config);
  return (error, req, res, next) => {
    req.app.locals.monitor = monitor;
    next();
    monitor.reportError(error);
    throw error;
  };
};

export { ExpressMonitorLocals, expressMonitor };
