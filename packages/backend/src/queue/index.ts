import type Config from '../config';
import type Logger from '../logger';

class Queue<T> {
  #config: Config;
  #locked: boolean;
  #logger: Logger;
  #value: T[];

  constructor(config: Config, logger: Logger) {
    this.#config = config;
    this.#logger = logger;
    this.#locked = false;
    this.#value = [];
  }

  push(items: T[]): void {
    this.#value.push(...items);
  }

  pop(): T[] {
    return this.#value.splice(0, this.#value.length);
  }

  startTimer(): NodeJS.Timer {
    return setInterval(async () => {
      if (!this.#locked && this.#value.length) {
        this.#locked = true;
        try {
          // todo
        } catch (e) {
          this.#logger.error(e);
        }
        this.#locked = false;
      }
    }, this.#config.getQueueConfig().timeout);
  }
}

export default Queue;
