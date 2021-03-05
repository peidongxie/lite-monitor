import { Request } from 'koa';
import { Event, JsonObject } from '@lite-monitor/base';

export type RequestHeader = NodeJS.Dict<string>;

export type RequestQuery = NodeJS.Dict<string | string[]>;

export type RequestBody = JsonObject | JsonObject[];

export type ResponseBody = JsonObject | JsonObject[];

export type Output = Promise<number | JsonObject | JsonObject[]>;

export type Controller = (request: Request) => Output;

export { Event, JsonObject };
