import type { RouteHandlerMethod } from 'fastify';

const route: RouteHandlerMethod = async (request, reply) => {
  reply.send('Hello World!');
};

export default route;
