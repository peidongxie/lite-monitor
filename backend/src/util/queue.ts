import { queue } from '../app';
import { PROJECT_INFO, PROJECT_PREFIX } from '../config/database';
import { TIMEOUT } from '../config/queue';
import { ProjectInfoSchema } from '../type/database';
import { Event } from '../type/server';
import { addDocument, findDocument } from './database';
import { error } from './logger';

export const initQueue = (): void => {
  setInterval(async () => {
    if (queue.state & (1 << 1) && queue.value.length) {
      queue.state &= ~(1 << 1);
      try {
        // 构建项目token——collection名称的Map
        const nameMap = new Map<string, string>();
        const projects = await findDocument<ProjectInfoSchema>(PROJECT_INFO);
        for (const project of projects || []) {
          nameMap.set(project.token, PROJECT_PREFIX + project.name);
        }
        // 构建项目token——上报事件的Map
        const eventsMap = new Map<string, Event[]>();
        for (const event of queue.pop()) {
          const { token } = event;
          const events = eventsMap.get(token);
          if (events) {
            events.push(event);
          } else {
            eventsMap.set(token, [event]);
          }
        }
        // 持久化上报事件
        for (const [token, name] of nameMap) {
          const events = eventsMap.get(token);
          if (events) await addDocument(name, events);
        }
      } catch (e) {
        error(e);
      }
      queue.state |= 1 << 1;
    }
  }, TIMEOUT);
};
