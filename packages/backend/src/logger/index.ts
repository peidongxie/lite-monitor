import type { FastifyLogFn, FastifyLoggerInstance } from 'fastify';
import type App from '../app';

class Logger {
  #value: FastifyLoggerInstance;

  constructor(app: App) {
    this.#value = app.getServer().getLoggerValue();
    this.error = this.#value.error;
    this.warn = this.#value.warn;
    this.info = this.#value.info;
    this.debug = this.#value.debug;
    this.trace = this.#value.trace;
  }

  debug: FastifyLogFn;

  error: FastifyLogFn;

  info: FastifyLogFn;

  trace: FastifyLogFn;

  warn: FastifyLogFn;
}

export default Logger;
