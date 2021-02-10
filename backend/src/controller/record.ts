import { getQueryValue } from '../util/request';
import { Controller } from '../type/app';

export const findRecord: Controller = async ({ request, response }) => {
  const project = getQueryValue(request.query, 'project');
  if (!project) {
    response.status = 400;
    response.body = 'Project Not Defined';
    return;
  }
  response.body = {
    message: 'ok',
  };
};

export const addRecord: Controller = async ({ response }) => {
  response.body = 'ok';
};

export const removeRecord: Controller = async ({ response }) => {
  response.body = 'ok';
};
