import Config from '../../config';
import Persitence from '../../persitence';
import type { RouteHandler } from '../../type';

interface RouteGenericInterface {
  Querystring: { project: string };
}

const config = Config.getInstance();
const persitence = Persitence.getInstance();

const route: RouteHandler<RouteGenericInterface> = async (request, reply) => {
  const { project } = request.query;
  if (!(typeof project === 'string')) {
    reply.badRequest();
  } else {
    const name = config.getProjectConfig().prefix + '_' + project;
    const records = await persitence.retrieveDocuments(name, {});
    reply.send(records);
  }
};

export default route;
