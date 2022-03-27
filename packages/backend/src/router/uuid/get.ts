import { randomUUID } from 'crypto';
import { type RouteHandler } from '../../type';

const route: RouteHandler = async (request, reply) => {
  reply.raw.statusMessage = `${Date.now()}-${randomUUID()}`;
  reply.send();
};

export { route as default };
