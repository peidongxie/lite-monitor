import { MongoClient, ObjectId } from 'mongodb';
import { ServiceOutput } from '../type/app';
import { addDocument, createCollection, findDocument } from '../util/db';
import { ProjectInfoSchema, ProjectType } from '../type/db';
import { PROJECT_INFO, PROJECT_PREFIX } from '../config/db';
import { PROJECT_NAME_REGEX } from '../config/app';

export const findOneProject = async (
  client: MongoClient,
  name: string,
): ServiceOutput => {
  const query = { name };
  const projects = await findDocument<ProjectInfoSchema>(
    client,
    PROJECT_INFO,
    query,
  );
  if (projects === null) return 500;
  if (projects.length === 0) return 404;
  const project = projects[0];
  return {
    id: project._id.toHexString(),
    name: project.name,
    showName: project.show_name,
    type: project.type,
    token: project.token,
  };
};

export const findAllProjects = async (client: MongoClient): ServiceOutput => {
  const projects = await findDocument<ProjectInfoSchema>(client, PROJECT_INFO);
  if (projects === null) return 500;
  return projects.map((project) => ({
    id: project._id.toHexString(),
    name: project.name,
    showName: project.show_name,
    type: project.type,
    token: project.token,
  }));
};

export const addOneProject = async (
  client: MongoClient,
  name: string,
  showName: string,
  type: ProjectType,
): ServiceOutput => {
  // 判断标识是否合法
  if (!PROJECT_NAME_REGEX.test(name)) return 400;
  // 持久化项目信息
  const data = {
    name,
    show_name: showName,
    type,
    token: new ObjectId().toHexString(),
  };
  const addResult = await addDocument<ProjectInfoSchema>(
    client,
    PROJECT_INFO,
    data,
  );
  // 创建项目对应collection
  if (addResult === null) return 500;
  const createResult = await createCollection<ProjectInfoSchema>(
    client,
    PROJECT_PREFIX + name,
  );
  if (createResult === null) return 500;
  return 200;
};
