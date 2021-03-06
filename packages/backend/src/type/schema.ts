import { type CompleteEvent } from '@lite-monitor/base';
import { type ProjectTypeValue } from './project';

interface BaseSchema {
  [key: string]: unknown;
}

interface ProjectMetaSchema extends BaseSchema {
  name: string;
  title: string;
  type: ProjectTypeValue;
  token: string;
}

interface ProjectEventsSchema extends BaseSchema, CompleteEvent {}

export { type BaseSchema, type ProjectEventsSchema, type ProjectMetaSchema };
