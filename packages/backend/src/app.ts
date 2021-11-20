import { Event } from '@lite-monitor/base';
import Config from './config';
import Logger from './logger';
import Persitence from './persitence';
import Queue from './queue';
import Server from './server';

class App {
  #config: Config;
  #logger?: Logger;
  #persitence?: Persitence;
  #queue?: Queue<Event>;
  #server: Server;

  constructor() {
    this.#config = new Config();
    this.#server = new Server(this.#config);
  }

  getConfig(): Config {
    return this.#config;
  }

  getLogger(): Logger | undefined {
    return this.#logger;
  }

  getPersitence(): Persitence | undefined {
    return this.#persitence;
  }

  getQueue(): Queue<Event> | undefined {
    return this.#queue;
  }

  getServer(): Server {
    return this.#server;
  }

  async start(): Promise<void> {
    try {
      const config = this.#config;
      const server = this.#server;
      await server.listen();
      const logger = new Logger(server);
      const persitence = new Persitence(server, logger);
      const queue = new Queue<Event>(config, logger);
      queue.startTimer();
      this.#logger = logger;
      this.#persitence = persitence;
      this.#queue = queue;
    } catch (e) {
      this.#logger?.error(e);
    }
  }
}

export default App;
