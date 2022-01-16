import fastify, {
  type FastifyInstance,
  type FastifyLogFn,
  type FastifyServerOptions,
} from 'fastify';
import cors from 'fastify-cors';
import {
  type FastifyMongoNestedObject,
  type FastifyMongoObject,
} from 'fastify-mongodb';
import sensible from 'fastify-sensible';
import Config from '../config';

class Server {
  private static instance: Server;

  public static getInstance(): Server {
    if (!this.instance) this.instance = new Server();
    return this.instance;
  }

  private value: FastifyInstance;

  private constructor() {
    this.value = fastify(this.getFastifyServerOptions());
    this.value.register(cors);
    this.value.register(sensible);
    this.error = this.value.log.error.bind(this.value.log);
    this.register = this.value.register.bind(this.value);
    this.route = this.value.route.bind(this.value);
  }

  public error: FastifyLogFn;

  public getClient(): FastifyMongoObject & FastifyMongoNestedObject {
    return this.value.mongo;
  }

  private getFastifyServerOptions(): FastifyServerOptions {
    const config = Config.getInstance();
    const { level, pretty } = config.getServerConfig();
    return {
      logger: {
        level,
        prettyPrint: pretty,
      },
    };
  }

  public listen(): Promise<string> {
    const config = Config.getInstance();
    return this.value.listen(config.getServerConfig().port, '0.0.0.0');
  }

  public register: FastifyInstance['register'];

  public route: FastifyInstance['route'];
}

export { Server as default };
