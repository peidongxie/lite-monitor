import { Request } from 'koa';

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

export type ResponseBody = JsonObject | JsonObject[];

export type Output = Promise<number | JsonObject | JsonObject[]>;

export type Controller = (request: Request) => Output;
