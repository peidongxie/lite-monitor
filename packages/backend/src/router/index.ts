import { type HTTPMethods, type RouteHandlerMethod } from 'fastify';
import path from 'path';
import Config from '../config';
import { type RouterConfig } from '../config';
import Server from '../server';

const httpMethods: HTTPMethods[] = [
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
];

class Router {
  static #instance: Router;
  #value: RouterConfig;

  static getInstance(): Router {
    if (!this.#instance) this.#instance = new this(this as never);
    return this.#instance;
  }

  constructor(args: never) {
    args;
    const config = Config.getInstance();
    this.#value = config.getRouterConfig();
  }

  async loadRoutes(): Promise<void> {
    const server = Server.getInstance();
    for (const { method, url } of this.#value.route) {
      const routeMethod = this.#parseRouteMethod(method.trim());
      const routeUrl = url.trim();
      if (!routeMethod) {
        server.error(`Bad Route: ${routeMethod || method.trim()} ${routeUrl}`);
      } else {
        const routePath = path.join('./', url, routeMethod.toLowerCase());
        const routeMoudle = await import('./' + routePath);
        const routeHandler: RouteHandlerMethod = routeMoudle.default;
        server.route({
          method: routeMethod,
          url: routeUrl,
          handler: routeHandler,
        });
      }
    }
  }

  #parseRouteMethod(method: string): HTTPMethods | null {
    const routeMethod = method.toUpperCase() as HTTPMethods;
    return httpMethods.includes(routeMethod) ? routeMethod : null;
  }
}

export { Router as default };
