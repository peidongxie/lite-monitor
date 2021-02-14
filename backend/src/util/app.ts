import { Response } from 'koa';
import { RequestHeader, RequestQuery, ResponseBody } from '../type/app';

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

export const setResponse = (
  response: Response,
  output: number | ResponseBody,
): void => {
  if (typeof output === 'number') {
    response.status = output;
  } else {
    response.body = output;
  }
};
