import { MongoClient, ObjectId } from 'mongodb';
import { Middleware } from '@koa/router';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

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
}

export interface ContextHeader {
  [key: string]: string;
}

export interface ContextQuery {
  [key: string]: string | string[];
}

export type ContextState = MongoClient;

export type Controller = Middleware<ContextState>;
