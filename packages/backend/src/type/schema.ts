import type { Event } from '@lite-monitor/base';
import type { ObjectId } from 'fastify-mongodb';
import type { ProjectTypeValue } from './project';

interface BaseSchema {
  _id?: ObjectId;
}

interface ProjectMetaSchema extends BaseSchema {
  name: string;
  title: string;
  type: ProjectTypeValue;
  token: string;
}

interface ProjectRecordSchema extends BaseSchema, Event {}

export type { BaseSchema, ProjectMetaSchema, ProjectRecordSchema };
