import { type RouteHandler } from '../../type';

const route: RouteHandler = async (request, reply) => {
  reply.send({
    time: Date.now(),
  });
};

export { route as default };
