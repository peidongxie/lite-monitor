import { Controller } from './server';

export enum RoutingMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export type Routing = Partial<Record<RoutingMethod, string>>;

export type RoutingTable = Record<string, Routing>;

export interface ControllerTable {
  [key: string]: Controller | ControllerTable;
}
