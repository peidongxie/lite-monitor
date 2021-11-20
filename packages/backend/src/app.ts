import { Event } from '@lite-monitor/base';
import Config from './config';
import Logger from './logger';
import Persitence from './persitence';
import Queue from './queue';
import Server from './server';
import { ProjectType } from './type';
import type { ProjectMetaSchema } from './type';

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
      this.#logger = logger;
      this.#persitence = persitence;
      this.#queue = queue;
      const { meta, prefix, startup } = config.getProjectConfig();
      // retrieve all collections
      const collections = await persitence.retrieveCollections({});
      if (!collections) return;
      if (collections.every((collection) => collection.name !== meta)) {
        await persitence.createCollection(meta);
      }
      // generate metadata of startup projects
      const startupProjects: ProjectMetaSchema[] = startup.map((project) => ({
        ...project,
        type:
          project.type === 'node'
            ? ProjectType.NODE
            : project.type === 'web'
            ? ProjectType.WEB
            : ProjectType.UNKNOWN,
      }));
      // retrieve metadata of tracked projects
      const trackedProjects =
        await persitence.retrieveDocuments<ProjectMetaSchema>(meta, {});
      if (!trackedProjects) return;
      // create metadata of untracked projects
      for (const startupProject of startupProjects) {
        if (
          trackedProjects.every(
            (trackedProject) => trackedProject.name !== startupProject.name,
          )
        ) {
          await persitence.createDocument<ProjectMetaSchema>(
            meta,
            startupProject,
          );
        }
      }
      // retrieve metadata of all projects
      const projects = await persitence.retrieveDocuments<ProjectMetaSchema>(
        meta,
        {},
      );
      if (!projects) return;
      // create collections for all projects
      for (const project of projects) {
        const name = prefix + '_' + project.name;
        if (collections.every((collection) => collection.name !== name)) {
          await persitence.createCollection(name);
        }
      }
      // start queue timer
      queue.startTimer();
    } catch (e) {
      this.#logger?.error(e);
    }
  }
}

export default App;
