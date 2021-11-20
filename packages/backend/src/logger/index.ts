import type { FastifyLogFn, FastifyLoggerInstance } from 'fastify';
import type Server from '../server';

class Logger {
  #value: FastifyLoggerInstance;

  constructor(server: Server) {
    this.#value = server.getLoggerValue();
    this.error = this.#value.error.bind(this.#value);
    this.warn = this.#value.warn.bind(this.#value);
    this.info = this.#value.info.bind(this.#value);
    this.debug = this.#value.debug.bind(this.#value);
    this.trace = this.#value.trace.bind(this.#value);
  }

  debug: FastifyLogFn;

  error: FastifyLogFn;

  info: FastifyLogFn;

  trace: FastifyLogFn;

  warn: FastifyLogFn;
}

export default Logger;
