import type { FastifyLogFn, FastifyLoggerInstance } from 'fastify';
import Server from '../server';

class Logger {
  static #instance: Logger;
  #value: FastifyLoggerInstance;

  static getInstance(): Logger {
    if (!this.#instance) this.#instance = new this(this as never);
    return this.#instance;
  }

  constructor(args: never) {
    args;
    const server = Server.getInstance();
    const value = server.getValue();
    this.#value = value.log;
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
