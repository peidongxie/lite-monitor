import fastify, {
  type FastifyInstance,
  type FastifyLogFn,
  type FastifyServerOptions,
} from 'fastify';
import cors from 'fastify-cors';
import sensible from 'fastify-sensible';
import Config from '../config';

class Server {
  private static instance: Server;

  public static getInstance(): Server {
    if (!this.instance) this.instance = new Server();
    return this.instance;
  }

  private listeners: {
    beforeListening: ((event: FastifyInstance) => void)[];
    afterListening: ((event: FastifyInstance) => void)[];
  };
  private value: FastifyInstance;

  private constructor() {
    this.listeners = { beforeListening: [], afterListening: [] };
    this.value = fastify(this.getFastifyServerOptions());
    this.error = this.value.log.error.bind(this.value.log);
    this.addListener('beforeListening', (event) => {
      event.register(cors);
      event.register(sensible);
    });
  }

  public addListener(
    type: 'beforeListening' | 'afterListening',
    listener: (event: FastifyInstance) => void,
  ): void {
    this.listeners[type].push(listener);
  }

  public error: FastifyLogFn;

  private getFastifyServerOptions(): FastifyServerOptions {
    const config = Config.getInstance();
    const { level, pretty } = config.getLoggerConfig();
    return {
      logger: {
        level,
        prettyPrint: pretty,
      },
    };
  }

  public async listen(): Promise<void> {
    for (const listener of this.listeners.beforeListening) {
      await listener(this.value);
    }
    const config = Config.getInstance();
    const port = config.getServerConfig().port;
    await this.value.listen(port, '0.0.0.0');
    for (const listener of this.listeners.afterListening) {
      await listener(this.value);
    }
  }
}

export { Server as default };
