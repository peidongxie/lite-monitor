import Config from './config';
import Logger from './logger';
import Persitence from './persitence';
import Queue from './queue';
import Router from './router';
import Server from './server';
import { ProjectType, type ProjectMetaSchema } from './type';

class App {
  config = Config.getInstance();
  logger = Logger.getInstance();
  router = Router.getInstance();
  persitence = Persitence.getInstance();
  queue = Queue.getInstance();
  server = Server.getInstance();

  public async start(): Promise<void> {
    const { meta, prefix, startup } = this.config.getProjectConfig();
    await this.server.listen();
    try {
      // retrieve all collections
      const collections = await this.persitence.retrieveCollections({});
      if (!collections) return;
      if (collections.every((collection) => collection.name !== meta)) {
        await this.persitence.createCollection(meta);
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
        await this.persitence.retrieveDocuments<ProjectMetaSchema>(meta, {});
      if (!trackedProjects) return;
      // create metadata of untracked projects
      for (const startupProject of startupProjects) {
        if (
          trackedProjects.every(
            (trackedProject) => trackedProject.name !== startupProject.name,
          )
        ) {
          await this.persitence.createDocument<ProjectMetaSchema>(
            meta,
            startupProject,
          );
        }
      }
      // retrieve metadata of all projects
      const projects =
        await this.persitence.retrieveDocuments<ProjectMetaSchema>(meta, {});
      if (!projects) return;
      // create collections for all projects
      for (const project of projects) {
        const name = prefix + '_' + project.name;
        if (collections.every((collection) => collection.name !== name)) {
          await this.persitence.createCollection(name);
        }
      }
    } catch (e) {
      Logger.getInstance().error(e);
    }
  }
}

export { App as default };
