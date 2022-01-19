import { type FastifyLoggerInstance } from 'fastify';
import Server from '../server';

type LogFn = (
  mergingObject: unknown,
  ...interpolationValues: unknown[]
) => void;

class Logger {
  private static instance: Logger;

  public static getInstance(): Logger {
    if (!this.instance) this.instance = new Logger();
    return this.instance;
  }

  private value?: FastifyLoggerInstance;

  private constructor() {
    this.trace = this.log.bind(this, 'trace');
    this.debug = this.log.bind(this, 'debug');
    this.info = this.log.bind(this, 'info');
    this.warn = this.log.bind(this, 'warn');
    this.error = this.log.bind(this, 'error');
    this.fatal = this.log.bind(this, 'fatal');
    Server.getInstance().addListener('afterListening', (event) => {
      this.value = event.log;
    });
  }

  public debug: LogFn;

  public error: LogFn;

  public fatal: LogFn;

  public info: LogFn;

  private log(
    level: Exclude<keyof FastifyLoggerInstance, 'child'>,
    mergingObject: unknown,
    ...interpolationValues: unknown[]
  ): void {
    if (typeof mergingObject === 'object' && mergingObject !== null) {
      this.value?.[level](mergingObject, undefined, ...interpolationValues);
    } else {
      this.value?.[level](String(mergingObject), ...interpolationValues);
    }
  }

  public trace: LogFn;

  public warn: LogFn;
}

export { Logger as default };
