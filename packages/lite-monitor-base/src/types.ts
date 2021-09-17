/**
 * Type of the JSON item
 * Variables of this type can be stringified
 */

export type JsonItem =
  | boolean
  | number
  | string
  | null
  | { [key: string]: JsonItem }
  | JsonItem[];

/**
 * Type of the event's 'type' field
 */

export enum AttrType {
  UNKNOWN = 0,
  ERROR = 1,
  RESOURCE = 2,
  MESSAGE = 3,
  COMPONENT = 4,
  ACCESS = 5,
}

/**
 * Type of the event's 'platform' field
 */

export enum AttrPlatform {
  UNKNOWN = 0,
  NODE = 1,
  CHROME = 2,
  EDGE = 3,
  FIREFOX = 4,
  IE = 5,
  OPERA = 6,
  SAFARI = 7,
}

/**
 * Type of the event's 'os' field
 */

export enum AttrOs {
  UNKNOWN = 0,
  AIX = 1,
  ANDROID = 2,
  DARWIN = 3,
  FREEBSD = 4,
  LINUX = 5,
  SUNOS = 6,
  OPENBSD = 7,
  WINDOWS = 8,
}

/**
 * Type of the event's 'arch' field
 */

export enum AttrArch {
  UNKNOWN = 0,
  ARM = 1,
  ARM64 = 2,
  IA32 = 3,
  MIPS = 4,
  MIPSEL = 5,
  PPC = 6,
  PPC64 = 7,
  S390 = 8,
  S390X = 9,
  X32 = 10,
  X64 = 11,
}

/**
 * Type of the event's 'orientation' field
 */

export enum AttrOrientation {
  UNKNOWN = 0,
  LANDSCAPE_PRIMARY = 1,
  LANDSCAPE_SECONDARY = 2,
  PORTRAIT_PRIMARY = 3,
  PORTRAIT_SECONDARY = 4,
}

/**
 * Type of the event's public attributes
 */

export interface PublicAttrs {
  type: AttrType;
  timestamp: number;
  token: string;
  user: string;
  core: number;
  memory: number;
  platform: AttrPlatform;
  platformVersion: string;
  os: AttrOs;
  osVersion: string;
  arch: AttrArch;
  orientation: AttrOrientation;
  screenResolution: [number, number];
  windowResolution: [number, number];
}

/**
 * Type of the event's private attributes
 */

export type PrivateAttrs = Record<string, JsonItem>;

/**
 * Type of the event
 */

export type Event = PublicAttrs & PrivateAttrs;

/**
 * Type of the error event
 */

export interface ErrorEvent extends Event {
  type: AttrType.ERROR;
  name: string;
  message: string;
  stack: string[];
}

/**
 * Type of the resource event's 'action' field
 */

export enum ResourceAction {
  UNKNOWN = 0,
  CREATE = 1,
  START = 2,
  PRODUCE = 3,
  CONSUME = 4,
  STOP = 5,
  DESTROY = 6,
}

/**
 * Type of the resource sequence element
 * A resource sequence describes multiple resource events that occur simultaneously
 */

export type ResourceSequenceElement = {
  action: ResourceAction;
  payload?: string;
};

/**
 * Type of the resource event
 */

export interface ResourceEvent extends Event {
  type: AttrType.RESOURCE;
  uid: string;
  action: ResourceAction;
  payload: string;
}

/**
 * Type of the message event's 'version' field
 */

export enum MessageVersion {
  UNKNOWN = 0,
  HTTP_0_9 = 1,
  HTTP_1_0 = 2,
  HTTP_1_1 = 3,
  HTTP_2 = 4,
  HTTP_3 = 5,
}

/**
 * Type of the message event's 'method' field
 */

export enum MessageMethod {
  UNKNOWN = 0,
  GET = 1,
  POST = 2,
  DELETE = 3,
  PUT = 4,
  CONNECT = 5,
  HEAD = 6,
  OPTIONS = 7,
  PATCH = 8,
  TRACE = 9,
}

/**
 * Type of the message event's 'protocol' field
 */

export enum MessageProtocol {
  UNKNOWN = 0,
  HTTP = 1,
  HTTPS = 2,
}

/**
 * Type of the message event
 */

export interface MessageEvent extends Event {
  type: AttrType.MESSAGE;
  method: MessageMethod;
  protocol: MessageProtocol;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  version: MessageVersion;
  referrer: string;
  ip: [string, string];
  code: number;
}

/**
 * Type of the component event's 'action' field
 */

export enum ComponentAction {
  UNKNOWN = 0,
  CHANGE = 1,
  CLICK = 2,
  ENTER = 3,
  OUT = 4,
  DRAG = 5,
  DROP = 6,
  PRESS = 7,
  CUT = 8,
  COPY = 9,
  PASTE = 10,
}

/**
 * Type of the component event
 */

export interface ComponentEvent extends Event {
  type: AttrType.COMPONENT;
  uid: string;
  xpath: string[];
  action: ComponentAction;
  payload: string;
}

/**
 * Type of the access event's 'method' filed
 */

export enum AccessMethod {
  UNKNOWN = 0,
  ENTER = 1,
  SWITCH = 2,
  LEAVE = 3,
  ACTIVATE = 4,
  INACTIVATE = 5,
}

/**
 * Type of the access event's 'protocol' filed
 */

export enum AccessProtocol {
  UNKNOWN = 0,
  HTTP = 1,
  HTTPS = 2,
}

/**
 * Type of the access event
 */

export interface AccessEvent extends Event {
  type: AttrType.ACCESS;
  method: AccessMethod;
  protocol: AccessProtocol;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  hash: string;
}
