import { Request } from 'koa';
import { Event, JsonItem } from '@lite-monitor/base';

export type RequestHeader = NodeJS.Dict<string>;

export type RequestQuery = NodeJS.Dict<string | string[]>;

export type RequestBody = Record<string, JsonItem> | JsonItem[];

export type ResponseBody = Record<string, JsonItem> | JsonItem[];

export type Output = Promise<number | Record<string, JsonItem> | JsonItem[]>;

export type Controller = (request: Request) => Output;

export type { Event, JsonItem };
