import bodyparser from 'koa-bodyparser';
import cors from '@koa/cors';
import { router, server } from '../app';
import { PORT } from '../config/server';
import { RequestHeader, RequestQuery } from '../type/server';
import { info } from './log';

export const getHeaderValue = (header: RequestHeader, key: string): string => {
  const value = header[key];
  return value === undefined ? '' : value;
};

export const getQueryList = (query: RequestQuery, key: string): string[] => {
  const value = query[key];
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

export const getQueryValue = (query: RequestQuery, key: string): string => {
  const value = query[key];
  if (value === undefined) return '';
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
