import type App from '../app';

class Queue<T> {
  #app: App;
  #locked: boolean;
  #value: T[];

  constructor(app: App) {
    this.#app = app;
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
          this.#app.getLogger().error(e);
        }
        this.#locked = false;
      }
    }, this.#app.getConfig().getQueueConfig().timeout);
  }
}

export default Queue;
