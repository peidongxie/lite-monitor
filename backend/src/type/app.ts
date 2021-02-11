import { MongoClient } from 'mongodb';
import { Middleware } from '@koa/router';

export interface RequestHeader {
  [key: string]: string;
}

export interface RequestQuery {
  [key: string]: string | string[];
}

export interface JsonObject {
  [key: string]: boolean | number | string | null | JsonObject | JsonObject[];
}

export type RequestBody = JsonObject | JsonObject[];

export type ContextState = MongoClient;

export type Controller = Middleware<ContextState>;
