import { Middleware } from '@koa/router';
import { router } from '../app';
import { ROUTING_TABLE } from '../config/router';
import { Controller } from '../type/server';
import { ControllerTable } from '../type/router';
import { error, info } from './logger';

export const pick = (table: ControllerTable, route: string): Controller => {
  let controller: Controller | ControllerTable = table;
  for (const path of route.split('/')) {
    controller = (controller as ControllerTable)[path];
  }
  return controller as Controller;
};

export const wrap = (controller: Controller): Middleware => {
  return async ({ request, response, _matchedRoute }) => {
    const output = await controller(request);
    const route = _matchedRoute || '/';
    if (typeof output === 'number') {
      if (output === 200) info(output, request.method, route);
      else error(output, request.method, route);
      response.status = output;
    } else {
      info(200, request.method, route);
      response.body = output;
    }
  };
};

export const initRouter = async (table: ControllerTable): Promise<void> => {
  const paths = Object.keys(ROUTING_TABLE).sort().reverse();
  for (const path of paths) {
    const routes = ROUTING_TABLE[path];
    routes.GET && router.get(path, wrap(pick(table, routes.GET)));
    routes.POST && router.post(path, wrap(pick(table, routes.POST)));
    routes.DELETE && router.delete(path, wrap(pick(table, routes.DELETE)));
    routes.PUT && router.put(path, wrap(pick(table, routes.PUT)));
  }
  info('Router is initialized.');
};
