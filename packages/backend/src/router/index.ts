import {
  type FastifyInstance,
  type HTTPMethods,
  type RouteHandlerMethod,
} from 'fastify';
import path from 'path';
import Config from '../config';
import Server from '../server';

const httpMethods: HTTPMethods[] = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  // 'CONNECT',
  'OPTIONS',
  'PATCH',
  // 'TRACE',
];

class Router {
  private static instance: Router;

  public static getInstance(): Router {
    if (!this.instance) this.instance = new Router();
    return this.instance;
  }

  private value: {
    method: string;
    url: string;
  }[];

  private constructor() {
    this.value = Config.getInstance().getRouterConfig().route;
    Server.getInstance().addListener('beforeListening', async (event) => {
      await this.loadRoutes(event);
    });
  }

  public async loadRoutes(event: FastifyInstance): Promise<void> {
    const server = Server.getInstance();
    for (const { method, url } of this.value) {
      const routeMethod = this.parseRouteMethod(method.trim());
      const routeUrl = url.trim();
      if (!routeMethod) {
        server.error(`Bad Route: ${routeMethod || method.trim()} ${routeUrl}`);
      } else {
        const routePath = path.join('./', url, routeMethod.toLowerCase());
        const routeMoudle = await import('./' + routePath);
        const routeHandler: RouteHandlerMethod = routeMoudle.default;
        event.route({
          method: routeMethod,
          url: routeUrl,
          handler: routeHandler,
        });
      }
    }
  }

  private parseRouteMethod(method: string): HTTPMethods | null {
    const routeMethod = method.toUpperCase() as HTTPMethods;
    return httpMethods.includes(routeMethod) ? routeMethod : null;
  }
}

export { Router as default };
