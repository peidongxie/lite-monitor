import { Middleware } from 'koa';
import { router } from '../app';
import { Controller } from '../type/server';
import { info } from './log';

export const wrap = (controller: Controller): Middleware => {
  return async ({ request, response }) => {
    const output = await controller(request);
    if (typeof output === 'number') response.status = output;
    else response.body = output;
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
