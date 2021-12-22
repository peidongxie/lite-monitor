import { type CompleteEvent } from '@lite-monitor/base';
import Queue from '../../queue';
import { type RouteHandler } from '../../type';

interface RouteGenericInterface {
  Body: CompleteEvent[];
}

const queue = Queue.getInstance();

const route: RouteHandler<RouteGenericInterface> = async (request, reply) => {
  const events = request.body;
  if (!Array.isArray(events)) {
    reply.badRequest();
  } else if (events.some((event) => typeof event.token !== 'string')) {
    reply.badRequest();
  } else {
    queue.enqueue(events);
    reply.code(204);
  }
};

export { route as default };
