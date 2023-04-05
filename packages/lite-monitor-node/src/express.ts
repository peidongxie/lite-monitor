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
    this.addErrorListener();
  }

  public defaultRouterHandler: RequestHandler = (req, res) => {
    res.status(404).end(`Cannot ${req.method} ${req.path}`);
  };

  public errorRequestHandler: ErrorRequestHandler = (error, req, res, next) => {
    this.reportError(error);
    next(error);
  };

  public requestHandler: RequestHandler = (req, res, next) => {
    req.app.locals.monitor = this;
    next();
    this.reportMessage(req, res.statusCode);
  };
}

export { ExpressMonitor, type ExpressMonitorLocals };
