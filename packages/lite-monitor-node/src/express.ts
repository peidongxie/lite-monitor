import { type ErrorRequestHandler, type RequestHandler } from 'express';
import { NodeMonitor, type MonitorConfig } from './monitor';

/**
 * Type(s) related to the Express monitor class
 */

interface ExpressMonitorLocals {
  monitor: NodeMonitor;
}

class ExpressMonitor extends NodeMonitor {
  constructor(config?: MonitorConfig) {
    super(config);
    this.globalErrorCatch();
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

export { ExpressMonitor, type ExpressMonitorLocals };
