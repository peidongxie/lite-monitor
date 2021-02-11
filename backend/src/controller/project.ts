import { ObjectId } from 'mongodb';
import { PROJECT_NAME_REGEX } from '../config/app';
import { PROJECT_INFO, PROJECT_PREFIX } from '../config/db';
import { Controller } from '../type/app';
import { ProjectInfoSchema } from '../type/db';
import { getBody } from '../util/app';
import { addDocument, createCollection, findDocument } from '../util/db';

export const findProject: Controller = async ({ response, state }) => {
  const projects = await findDocument<ProjectInfoSchema>(state, PROJECT_INFO);
  if (projects === null) {
    response.status = 500;
    response.body = 'Database Error';
    return;
  }
  response.body = projects.map((project) => ({
    id: project._id.toHexString(),
    name: project.name,
    showName: project.show_name,
    type: project.type,
    token: project.token,
  }));
};

export const addProject: Controller = async ({ request, response, state }) => {
  const body = getBody<{ name: string; showName: string; type: number }>(
    request.body,
  );
  if (!PROJECT_NAME_REGEX.test(body.name)) {
    response.status = 400;
    response.body = 'Illegal Project Name';
    return;
  }
  const projects = await findDocument<ProjectInfoSchema>(state, PROJECT_INFO);
  if (projects === null) {
    response.status = 500;
    response.body = 'Database Error';
    return;
  }
  if (projects.some((project) => project.name === body.name)) {
    response.status = 400;
    response.body = 'Illegal Project Name';
    return;
  }
  const addResult = await addDocument<ProjectInfoSchema>(state, PROJECT_INFO, {
    name: body.name,
    show_name: body.showName,
    type: body.type,
    token: new ObjectId().toHexString(),
  });
  if (addResult === null) {
    response.status = 500;
    response.body = 'Database Error';
    return;
  }
  const name = PROJECT_PREFIX + body.name;
  const createResult = await createCollection<ProjectInfoSchema>(state, name);
  if (createResult === null) {
    response.status = 500;
    response.body = 'Database Error';
    return;
  }
  response.body = 'OK';
};
