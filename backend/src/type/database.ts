import { ObjectId } from 'mongodb';

export enum ProjectType {
  UNKNOWN = 0,
  WEB = 1,
  NODE = 2,
}

export interface BaseSchema {
  _id: ObjectId;
}

export interface ProjectInfoSchema extends BaseSchema {
  name: string;
  show_name: string;
  type: ProjectType;
  token: string;
}
