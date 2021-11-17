import { Event } from '@lite-monitor/base';
import Config from './config';
import Logger from './logger';
import Persitence from './persitence';
import Queue from './queue';
import Server from './server';

class App {
  #config: Config;
  #logger: Logger;
  #persitence: Persitence;
  #queue: Queue<Event>;
  #server: Server;

  constructor() {
    this.#config = new Config();
    this.#server = new Server(this);
    this.#logger = new Logger(this);
    this.#persitence = new Persitence(this);
    this.#queue = new Queue<Event>(this);
  }

  getConfig(): Config {
    return this.#config;
  }

  getLogger(): Logger {
    return this.#logger;
  }

  getPersitence(): Persitence {
    return this.#persitence;
  }

  getServer(): Server {
    return this.#server;
  }

  async start(): Promise<void> {
    try {
      this.#queue.startTimer();
      await this.#server.listen();
    } catch (e) {
      this.#logger.error(e);
    }
  }
}

export default App;
