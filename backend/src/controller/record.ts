import { getQueryValue } from '../util/request';
import { Controller } from '../type/app';

export const findRecord: Controller = async (ctx) => {
  const project = getQueryValue(ctx.query, 'project');
  if (!project) {
    ctx.status = 400;
    ctx.body = 'Project Not Defined';
    return;
  }
  ctx.body = {
    message: 'ok',
  };
};

export const addRecord: Controller = async (ctx) => {
  ctx.body = 'ok';
};

export const removeRecord: Controller = async (ctx) => {
  ctx.body = 'ok';
};
