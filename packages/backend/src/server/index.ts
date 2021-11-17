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
import type App from '../app';

class Server {
  #app: App;
  #value: FastifyInstance;

  constructor(app: App) {
    this.#app = app;
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
    return this.#value.listen(this.#app.getConfig().getServerConfig().port);
  }

  #parseLoggerConfig(): FastifyLoggerOptions {
    const { level, pretty } = this.#app.getConfig().getLoggerConfig();
    return {
      level,
      prettyPrint: pretty,
    };
  }

  #parsePersitenceConfig(): FastifyMongodbOptions {
    const { host, name, password, port, username } = this.#app
      .getConfig()
      .getPersitenceConfig();
    return {
      forceClose: true,
      name,
      url: `mongodb://${username}:${password}@${host}:${port}`,
    };
  }
}

export default Server;
