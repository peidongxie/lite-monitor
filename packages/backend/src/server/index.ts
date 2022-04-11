import fastify, {
  type FastifyInstance,
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

  public async close(): Promise<void> {
    await this.value.close();
  }

  public async listen(): Promise<void> {
    for (const listener of this.listeners.beforeListening) {
      await listener(this.value);
    }
    const config = Config.getInstance();
    const { port, address } = config.getServerConfig();
    await this.value.listen(port, address);
    for (const listener of this.listeners.afterListening) {
      await listener(this.value);
    }
  }

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
}

export { Server as default };
