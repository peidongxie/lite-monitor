import { ErrorRequestHandler, RequestHandler } from 'express';
import { MonitorConfig, NodeMonitor } from './monitor';

export interface ExpressMonitorLocals {
  monitor: NodeMonitor;
}

export class ExpressMonitor extends NodeMonitor {
  constructor(config: MonitorConfig) {
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
    this.reportMessage(req, res.statusCode).finally();
  };

  defaultRouterHandler: RequestHandler = (req, res) => {
    res.status(404).end(`Cannot ${req.method} ${req.path}`);
  };

  errorRequestHandler: ErrorRequestHandler = (error, req, res, next) => {
    this.reportError(error).finally();
    next(error);
  };
}
