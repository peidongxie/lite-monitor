import type { Event } from '@lite-monitor/base';
import type Config from '../config';
import type Logger from '../logger';
import type Persitence from '../persitence';
import type { ProjectMetaSchema, ProjectRecordSchema } from '../type';

class Queue {
  #config: Config;
  #locked: boolean;
  #logger: Logger;
  #persitence: Persitence;
  #value: Event[];

  constructor(config: Config, logger: Logger, persitence: Persitence) {
    this.#config = config;
    this.#logger = logger;
    this.#persitence = persitence;
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
    const { meta, prefix } = this.#config.getProjectConfig();
    return setInterval(async () => {
      if (!this.#locked && this.#value.length) {
        this.#locked = true;
        try {
          const projects =
            await this.#persitence.retrieveDocuments<ProjectMetaSchema>(
              meta,
              {},
            );
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
              await this.#persitence.createDocuments<ProjectRecordSchema>(
                prefix + '_' + name,
                events,
              );
          }
        } catch (e) {
          this.#logger.error(e);
        }
        this.#locked = false;
      }
    }, this.#config.getQueueConfig().timeout);
  }
}

export default Queue;
