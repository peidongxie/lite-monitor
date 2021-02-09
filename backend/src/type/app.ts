import { MongoClient } from 'mongodb';
import { Middleware } from '@koa/router';

export interface ContextHeader {
  [key: string]: string;
}

export interface ContextQuery {
  [key: string]: string | string[];
}

export type ContextState = MongoClient;

export type Controller = Middleware<ContextState>;
