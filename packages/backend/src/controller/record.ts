import { Controller } from '../type/server';
import { addRecords } from '../service/record';
import { getQueryValue } from '../util/server';

export const findRecord: Controller = async ({ query }) => {
  const project = getQueryValue(query, 'project');
  if (!project) return 400;
  return 200;
};

export const addRecord: Controller = async ({ body }) => {
  if (!Array.isArray(body)) return 400;
  return addRecords(body.filter((e) => e.token));
};
