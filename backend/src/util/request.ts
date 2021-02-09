import { ContextHeader, ContextQuery } from '../type/app';

export const getHeaderValue = (header: ContextHeader, key: string): string => {
  return Object.prototype.hasOwnProperty.call(header, key) ? header[key] : '';
};

export const getQueryList = (query: ContextQuery, key: string): string[] => {
  if (!Object.prototype.hasOwnProperty.call(query, key)) return [];
  const value = query[key];
  return Array.isArray(value) ? value : [value];
};

export const getQueryValue = (query: ContextQuery, key: string): string => {
  if (!Object.prototype.hasOwnProperty.call(query, key)) return '';
  const value = query[key];
  return Array.isArray(value) ? String(value) : value;
};
