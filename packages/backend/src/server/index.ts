import fastify from 'fastify';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import cors from 'fastify-cors';
import mongodb from 'fastify-mongodb';
import type { FastifyMongodbOptions } from 'fastify-mongodb';
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
    this.#value.register(mongodb, this.#getFastifyMongodbOptions());
    this.#value.route({
      method: 'GET',
      url: '/',
      handler: async () => 'Hello World!',
    });
  }

  getValue(): FastifyInstance {
    return this.#value;
  }

  listen(): Promise<string> {
    const config = Config.getInstance();
    return this.#value.listen(config.getServerConfig().port);
  }

  #getFastifyServerOptions(): FastifyServerOptions {
    const config = Config.getInstance();
    const { level, pretty } = config.getLoggerConfig();
    return {
      logger: {
        level,
        prettyPrint: pretty,
      },
    };
  }

  #getFastifyMongodbOptions(): FastifyMongodbOptions {
    const config = Config.getInstance();
    const { database, host, password, port, username } =
      config.getPersitenceConfig();
    return {
      forceClose: true,
      database,
      url: `mongodb://${username}:${password}@${host}:${port}`,
    };
  }
}

export default Server;
