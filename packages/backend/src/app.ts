import Config from './config';
import Logger from './logger';
import Persistence from './persistence';
import Queue from './queue';
import Router from './router';
import Server from './server';
import { ProjectType, type ProjectMetaSchema } from './type';

class App {
  config = Config.getInstance();
  logger = Logger.getInstance();
  router = Router.getInstance();
  persistence = Persistence.getInstance();
  queue = Queue.getInstance();
  server = Server.getInstance();

  public async start(): Promise<void> {
    const { meta, prefix, startup } = this.config.getProjectConfig();
    await this.server.listen();
    try {
      // retrieve all collections
      const collections = await this.persistence.retrieveCollections({});
      if (!collections) return;
      if (collections.every((collection) => collection.name !== meta)) {
        await this.persistence.createCollection(meta);
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
        await this.persistence.retrieveDocuments<ProjectMetaSchema>(meta, {});
      if (!trackedProjects) return;
      // create metadata of untracked projects
      for (const startupProject of startupProjects) {
        if (
          trackedProjects.every(
            (trackedProject) => trackedProject.name !== startupProject.name,
          )
        ) {
          await this.persistence.createDocument<ProjectMetaSchema>(
            meta,
            startupProject,
          );
        }
      }
      // retrieve metadata of all projects
      const projects =
        await this.persistence.retrieveDocuments<ProjectMetaSchema>(meta, {});
      if (!projects) return;
      // create collections for all projects
      for (const project of projects) {
        const name = prefix + '_' + project.name;
        if (collections.every((collection) => collection.name !== name)) {
          await this.persistence.createCollection(name);
          await this.persistence.createIndex(name, 'timestamp');
        }
      }
    } catch (e) {
      Logger.getInstance().error(e);
    }
  }

  public async stop(): Promise<void> {
    await this.server.close();
  }
}

export { App as default };
