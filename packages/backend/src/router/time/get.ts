import { type RouteHandler } from '../../type';

const route: RouteHandler = async (request, reply) => {
  reply.raw.statusMessage = String(Date.now());
  reply.send();
};

export { route as default };
