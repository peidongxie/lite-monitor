import Config from './config';
import Logger from './logger';
import Persitence from './persitence';
import Queue from './queue';
import Server from './server';
import { ProjectType } from './type';
import type { ProjectMetaSchema } from './type';

class App {
  static #instance: App;

  static getInstance(): App {
    if (!this.#instance) this.#instance = new this(this as never);
    return this.#instance;
  }

  constructor(args: never) {
    args;
  }

  async start(): Promise<void> {
    const config = Config.getInstance();
    const { meta, prefix, startup } = config.getProjectConfig();
    const server = Server.getInstance();
    await server.listen();
    const logger = Logger.getInstance();
    const persitence = Persitence.getInstance();
    const queue = Queue.getInstance();
    try {
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
      logger.error(e);
    }
  }
}

export default App;
