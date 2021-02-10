import { ObjectId } from 'mongodb';

export enum ProjectType {
  WEB = 0,
  NODE = 1,
}

export interface BaseSchema {
  _id: ObjectId;
}

export interface ProjectInfoSchema extends BaseSchema {
  name: string;
  type: ProjectType;
  token: string;
}
