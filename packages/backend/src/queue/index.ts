import type { Event } from '@lite-monitor/base';
import Config from '../config';
import Logger from '../logger';
import Persitence from '../persitence';
import type { ProjectMetaSchema, ProjectRecordSchema } from '../type';

class Queue {
  static #instance: Queue;
  #locked: boolean;
  #value: Event[];

  static getInstance(): Queue {
    if (!this.#instance) this.#instance = new this(this as never);
    return this.#instance;
  }

  constructor(args: never) {
    args;
    this.#locked = false;
    this.#value = [];
  }

  enqueue(items: Event[]): void {
    this.#value.push(...items);
  }

  dequeue(): Event[] {
    return this.#value.splice(0, this.#value.length);
  }

  startTimer(): NodeJS.Timer {
    const config = Config.getInstance();
    const logger = Logger.getInstance();
    const persitence = Persitence.getInstance();
    const { meta, prefix } = config.getProjectConfig();
    const { timeout } = config.getQueueConfig();
    return setInterval(async () => {
      if (!this.#locked && this.#value.length) {
        this.#locked = true;
        try {
          const projects =
            await persitence.retrieveDocuments<ProjectMetaSchema>(meta, {});
          const eventsMap = new Map<string, Event[]>();
          for (const project of projects || []) {
            eventsMap.set(project.token, []);
          }
          for (const event of this.dequeue()) {
            eventsMap.get(event.token)?.push(event);
          }
          for (const { name, token } of projects || []) {
            const events = eventsMap.get(token);
            if (events?.length)
              await persitence.createDocuments<ProjectRecordSchema>(
                prefix + '_' + name,
                events,
              );
          }
        } catch (e) {
          logger.error(e);
        }
        this.#locked = false;
      }
    }, timeout);
  }
}

export default Queue;
