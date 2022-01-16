import Config from './config';
import Persitence from './persitence';
import Queue from './queue';
import Router from './router';
import Server from './server';
import { ProjectType, type ProjectMetaSchema } from './type';

class App {
  public async start(): Promise<void> {
    const config = Config.getInstance();
    const server = Server.getInstance();
    const router = Router.getInstance();
    const queue = Queue.getInstance();
    const persitence = Persitence.getInstance();
    const { meta, prefix, startup } = config.getProjectConfig();
    await router.loadRoutes();
    await server.listen();
    try {
      // initialize queue and persitence
      queue.startTimer();
      persitence.setClient(server.getClient());
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
    } catch (e) {
      server.error(e);
    }
  }
}

export { App as default };
