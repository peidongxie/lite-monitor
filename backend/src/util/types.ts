import { Middleware } from '@koa/router';

export interface ContextHeader {
  [key: string]: string;
}

export interface ContextQuery {
  [key: string]: string | string[];
}

export type Controller = Middleware;
