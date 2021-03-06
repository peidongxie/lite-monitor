import { PROJECT_INFO, PROJECT_PREFIX } from '../config/database';
import { PROJECT_NAME_REGEX } from '../config/server';
import { ProjectSchema, ProjectType } from '../type/database';
import { Output } from '../type/server';
import { addDocument, createCollection, findDocument } from '../util/database';

const getUid = (length: number): string => {
  let uid = '';
  while (uid.length < length) {
    const key = Math.floor(Math.random() * (1 << 16));
    uid += key.toString(16).padStart(4, '0');
  }
  return uid.substr(0, length);
};

export const findOneProject = async (name: string): Output => {
  const query = { name };
  const projects = await findDocument<ProjectSchema>(PROJECT_INFO, query);
  if (projects === null) return 500;
  if (projects.length === 0) return 404;
  const project = projects[0];
  return {
    id: project._id?.toHexString() || '',
    name: project.name,
    showName: project.show_name,
    type: project.type,
    token: project.token,
  };
};

export const findAllProjects = async (): Output => {
  const projects = await findDocument<ProjectSchema>(PROJECT_INFO);
  if (projects === null) return 500;
  return projects.map((project) => ({
    id: project._id?.toHexString() || '',
    name: project.name,
    showName: project.show_name,
    type: project.type,
    token: project.token,
  }));
};

export const addOneProject = async (
  name: string,
  showName: string,
  type: ProjectType,
): Output => {
  // 判断标识是否合法
  if (!PROJECT_NAME_REGEX.test(name)) return 400;
  // 持久化项目信息
  const data = {
    name,
    show_name: showName,
    type,
    token: getUid(16),
  };
  const addResult = await addDocument<ProjectSchema>(PROJECT_INFO, data);
  // 创建项目对应collection
  if (addResult === null) return 500;
  const createResult = await createCollection<ProjectSchema>(
    PROJECT_PREFIX + name,
  );
  if (createResult === null) return 500;
  return 200;
};
