import { Middleware } from '@koa/router';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface ContextHeader {
  [key: string]: string;
}

export interface ContextQuery {
  [key: string]: string | string[];
}

export type Controller = Middleware;
