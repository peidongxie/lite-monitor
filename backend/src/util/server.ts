import bodyparser from 'koa-bodyparser';
import cors from '@koa/cors';
import { router, server } from '../app';
import { PORT } from '../config/server';
import { RequestHeader, RequestQuery } from '../type/server';
import { info } from './log';

export const getHeaderValue = (header: RequestHeader, key: string): string => {
  return Object.prototype.hasOwnProperty.call(header, key) ? header[key] : '';
};

export const getQueryList = (query: RequestQuery, key: string): string[] => {
  if (!Object.prototype.hasOwnProperty.call(query, key)) return [];
  const value = query[key];
  return Array.isArray(value) ? value : [value];
};

export const getQueryValue = (query: RequestQuery, key: string): string => {
  if (!Object.prototype.hasOwnProperty.call(query, key)) return '';
  const value = query[key];
  return Array.isArray(value) ? String(value) : value;
};

export const initServer = async (): Promise<void> => {
  server.use(cors());
  server.use(bodyparser());
  server.use(router.routes());
  server.use(router.allowedMethods());
  info('Server is initialized.');
};

export const startServer = (): void => {
  server.listen(PORT);
  info(`Service is listening on port ${PORT}.`);
};
