import type { Event } from '@lite-monitor/base';
import type { Document, ObjectId } from 'mongodb';

type MapKey<M> = keyof M;
type MapValue<M> = M[MapKey<M>];

export const ProjectType = {
  UNKNOWN: 0,
  WEB: 1,
  NODE: 2,
} as const;
export type ProjectTypeMap = typeof ProjectType;
export type ProjectTypeKey = MapKey<ProjectTypeMap>;
export type ProjectTypeValue = MapValue<ProjectTypeMap>;

export interface BaseSchema extends Document {
  _id?: ObjectId;
}

export interface ProjectInfoSchema extends BaseSchema {
  name: string;
  title: string;
  type: ProjectTypeValue;
  token: string;
}

export interface ProjectRecordSchema extends BaseSchema, Event {}
