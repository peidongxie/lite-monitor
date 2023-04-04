import Config from '../../config';
import Persistence from '../../persistence';
import { type RouteHandler } from '../../type';

interface RouteGenericInterface {
  Querystring: { project: string };
}

const config = Config.getInstance();
const persistence = Persistence.getInstance();

const route: RouteHandler<RouteGenericInterface> = async (request, reply) => {
  const { project } = request.query;
  if (!(typeof project === 'string')) {
    reply.badRequest();
  } else {
    const name = config.getProjectConfig().prefix + '_' + project;
    const events = await persistence.retrieveDocuments(name, {});
    reply.send(events);
  }
};

export { route as default };
