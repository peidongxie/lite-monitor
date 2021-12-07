import type { ErrorRequestHandler, RequestHandler } from 'express';
import { NodeMonitor } from './monitor';
import type { MonitorConfig } from './monitor';

/**
 * Type(s) related to the Express monitor class
 */

interface ExpressMonitorLocals {
  monitor: NodeMonitor;
}

class ExpressMonitor extends NodeMonitor {
  constructor(config?: Partial<MonitorConfig>) {
    super(config);
    process.on('uncaughtException', (error) => {
      console.error(error);
      this.reportError(error).then(() => {
        if (process.listenerCount('uncaughtException') === 1) process.exit();
      });
    });
  }

  requestHandler: RequestHandler = (req, res, next) => {
    req.app.locals.monitor = this;
    next();
    this.reportMessage(req, res.statusCode);
  };

  defaultRouterHandler: RequestHandler = (req, res) => {
    res.status(404).end(`Cannot ${req.method} ${req.path}`);
  };

  errorRequestHandler: ErrorRequestHandler = (error, req, res, next) => {
    this.reportError(error);
    next(error);
  };
}

export { ExpressMonitor };
export type { ExpressMonitorLocals };
