import { type CompleteEvent } from '@lite-monitor/base';
import Config from '../config';
import Server from '../server';
import Persitence from '../persitence';
import { type ProjectEventsSchema, type ProjectMetaSchema } from '../type';

class Queue {
  static #instance: Queue;
  #locked: boolean;
  #value: CompleteEvent[];

  static getInstance(): Queue {
    if (!this.#instance) this.#instance = new this(this as never);
    return this.#instance;
  }

  constructor(args: never) {
    args;
    this.#locked = false;
    this.#value = [];
  }

  enqueue(items: CompleteEvent[]): void {
    this.#value.push(...items);
  }

  dequeue(): CompleteEvent[] {
    return this.#value.splice(0, this.#value.length);
  }

  startTimer(): NodeJS.Timer {
    const config = Config.getInstance();
    const server = Server.getInstance();
    const persitence = Persitence.getInstance();
    const { meta, prefix } = config.getProjectConfig();
    const { timeout } = config.getQueueConfig();
    return setInterval(async () => {
      if (!this.#locked && this.#value.length) {
        this.#locked = true;
        try {
          const projects =
            await persitence.retrieveDocuments<ProjectMetaSchema>(meta, {});
          const eventsMap = new Map<string, CompleteEvent[]>();
          for (const project of projects || []) {
            eventsMap.set(project.token, []);
          }
          for (const event of this.dequeue()) {
            eventsMap.get(event.token)?.push(event);
          }
          for (const { name, token } of projects || []) {
            const events = eventsMap.get(token);
            if (events?.length)
              await persitence.createDocuments<ProjectEventsSchema>(
                prefix + '_' + name,
                events,
              );
          }
        } catch (e) {
          server.error(e);
        }
        this.#locked = false;
      }
    }, timeout);
  }
}

export { Queue as default };
