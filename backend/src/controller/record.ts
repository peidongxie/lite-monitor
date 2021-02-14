import { Controller } from '../type/server';
import { getQueryValue } from '../util/server';

export const findRecord: Controller = async ({ query }) => {
  const project = getQueryValue(query, 'project');
  if (!project) return 400;
  return 200;
};
