import fastify from 'fastify';
import type {
  FastifyInstance,
  FastifyLoggerInstance,
  FastifyLoggerOptions,
} from 'fastify';
import cors from 'fastify-cors';
import mongodb from 'fastify-mongodb';
import type {
  FastifyMongoObject,
  FastifyMongoNestedObject,
  FastifyMongodbOptions,
} from 'fastify-mongodb';
import sensible from 'fastify-sensible';
import type Config from '../config';
class Server {
  #config: Config;
  #value: FastifyInstance;

  constructor(config: Config) {
    this.#config = config;
    this.#value = fastify({ logger: this.#parseLoggerConfig() });
    this.#value.register(cors);
    this.#value.register(sensible);
    this.#value.register(mongodb, this.#parsePersitenceConfig());
    this.#value.route({
      method: 'GET',
      url: '/',
      handler: async () => 'Hello World!',
    });
  }

  getLoggerValue(): FastifyLoggerInstance {
    return this.#value.log;
  }

  getPersitenceValue(): FastifyMongoObject & FastifyMongoNestedObject {
    return this.#value.mongo;
  }

  listen(): Promise<string> {
    return this.#value.listen(this.#config.getServerConfig().port);
  }

  #parseLoggerConfig(): FastifyLoggerOptions {
    const { level, pretty } = this.#config.getLoggerConfig();
    return {
      level,
      prettyPrint: pretty,
    };
  }

  #parsePersitenceConfig(): FastifyMongodbOptions {
    const { database, host, password, port, username } =
      this.#config.getPersitenceConfig();
    return {
      forceClose: true,
      database,
      url: `mongodb://${username}:${password}@${host}:${port}`,
    };
  }
}

export default Server;
