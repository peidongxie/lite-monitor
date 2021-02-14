import { Middleware } from '@koa/router';
import { router } from '../app';
import { Controller } from '../type/server';
import { error, info } from './log';

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

export const initRouter = async (
  config: { path: string; controllers: (Controller | null)[] }[],
): Promise<void> => {
  for (const { path, controllers } of config) {
    const [find, add, remove, change] = controllers;
    find && router.get(path, wrap(find));
    add && router.post(path, wrap(add));
    remove && router.delete(path, wrap(remove));
    change && router.put(path, wrap(change));
  }
  info('Router is initialized.');
};
