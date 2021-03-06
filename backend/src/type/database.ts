import { ObjectId } from 'mongodb';
import { Event } from '../type/server';

export enum ProjectType {
  UNKNOWN = 0,
  WEB = 1,
  NODE = 2,
}

export interface BaseSchema {
  _id?: ObjectId;
}

export interface ProjectSchema extends BaseSchema {
  name: string;
  show_name: string;
  type: ProjectType;
  token: string;
}

export type RecordSchema = BaseSchema & Event;
