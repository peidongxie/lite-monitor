import {
  addOneProject,
  findAllProjects,
  findOneProject,
} from '../service/project';
import { ProjectType } from '../type/database';
import { Controller } from '../type/server';
import { getQueryValue } from '../util/server';

export const findProject: Controller = async ({ query }) => {
  const name = getQueryValue(query, 'name');
  if (name === '') return findAllProjects();
  else return findOneProject(name);
};

export const addProject: Controller = async ({ body }) => {
  const name: string = body.name && '';
  const showName: string = body.showName && '';
  const type: ProjectType = body.type && ProjectType.UNKNOWN;
  return addOneProject(name, showName, type);
};
