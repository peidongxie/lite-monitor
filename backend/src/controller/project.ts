import {
  addOneProject,
  findAllProjects,
  findOneProject,
} from '../service/project';
import { Controller } from '../type/app';
import { ProjectType } from '../type/db';
import { getQueryValue, setResponse } from '../util/app';

export const findProject: Controller = async ({
  request: { query },
  response,
  state,
}) => {
  const name = getQueryValue(query, 'name');
  if (name === '') {
    const output = await findAllProjects(state);
    setResponse(response, output);
  } else {
    const output = await findOneProject(state, name);
    setResponse(response, output);
  }
};

export const addProject: Controller = async ({ request, response, state }) => {
  const raw = request.body;
  const name: string = raw.name && '';
  const showName: string = raw.showName && '';
  const type: ProjectType = raw.type && ProjectType.UNKNOWN;
  const output = await addOneProject(state, name, showName, type);
  setResponse(response, output);
};
