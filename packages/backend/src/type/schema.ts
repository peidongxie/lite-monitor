import type { CompleteEvent } from '@lite-monitor/base';
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

interface ProjectEventsSchema extends BaseSchema, CompleteEvent {}

export type { BaseSchema, ProjectEventsSchema, ProjectMetaSchema };
