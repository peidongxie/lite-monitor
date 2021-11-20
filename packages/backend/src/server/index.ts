import fastify from 'fastify';
import type {
  FastifyInstance,
  FastifyLogFn,
  FastifyRegister,
  FastifyServerOptions,
} from 'fastify';
import type {
  FastifyMongoNestedObject,
  FastifyMongoObject,
} from 'fastify-mongodb';
import cors from 'fastify-cors';
import sensible from 'fastify-sensible';
import Config from '../config';

class Server {
  static #instance: Server;
  #value: FastifyInstance;

  static getInstance(): Server {
    if (!this.#instance) this.#instance = new this(this as never);
    return this.#instance;
  }

  constructor(args: never) {
    args;
    this.#value = fastify(this.#getFastifyServerOptions());
    this.#value.register(cors);
    this.#value.register(sensible);
    this.error = this.#value.log.error.bind(this.#value.log);
    this.register = this.#value.register.bind(this.#value);
  }

  error: FastifyLogFn;

  getClient(): FastifyMongoObject & FastifyMongoNestedObject {
    return this.#value.mongo;
  }

  listen(): Promise<string> {
    const config = Config.getInstance();
    return this.#value.listen(config.getServerConfig().port);
  }

  register: FastifyRegister;

  #getFastifyServerOptions(): FastifyServerOptions {
    const config = Config.getInstance();
    const { level, pretty } = config.getServerConfig();
    return {
      logger: {
        level,
        prettyPrint: pretty,
      },
    };
  }
}

export default Server;
