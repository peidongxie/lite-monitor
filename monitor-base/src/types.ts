/**
 * 公共事件类型
 */

export type JsonItem =
  | boolean
  | number
  | string
  | null
  | { [key: string]: JsonItem }
  | JsonItem[];

export enum AttrType {
  UNKNOWN = 0,
  ERROR = 1,
  RESOURCE = 2,
  MESSAGE = 3,
}

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

export enum AttrOrientation {
  UNKNOWN = 0,
  LANDSCAPE_PRIMARY = 1,
  LANDSCAPE_SECONDARY = 2,
  PORTRAIT_PRIMARY = 3,
  PORTRAIT_SECONDARY = 4,
}

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

export type PrivateAttrs = Record<string, JsonItem>;

export type Event = PublicAttrs & PrivateAttrs;

/**
 * 错误事件类型
 */

export interface ErrorEvent extends Event {
  name: string;
  message: string;
  stack: string[];
}

/**
 * 资源事件类型
 */

export enum ResourceAction {
  UNKNOWN = 0,
  CREATE = 1,
  START = 2,
  USE = 3,
  CHECK = 4,
  STOP = 5,
  DESTROY = 6,
}

export type ResourceSequenceElement = {
  action: ResourceAction;
  success: boolean;
  message: string;
};

export interface ResourceEvent extends Event {
  name: string;
  sequence: ResourceSequenceElement[];
}

/**
 * 报文事件类型
 */

export enum MessageVersion {
  UNKNOWN = 0,
  HTTP_0_9 = 1,
  HTTP_1_0 = 2,
  HTTP_1_1 = 3,
  HTTP_2 = 4,
  HTTP_3 = 5,
}

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

export enum MessageProtocol {
  UNKNOWN = 0,
  HTTP = 1,
  HTTPS = 2,
}

export interface MessageEvent extends Event {
  version: MessageVersion;
  method: MessageMethod;
  protocol: MessageProtocol;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  code: number;
  referrer: string;
  ip: [string, string];
}

/**
 * 组件事件类型
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

export interface ComponentEvent extends Event {
  action: ComponentAction;
  name: string;
}

/**
 * 访问事件类型
 */

export enum AccessAction {
  UNKNOWN = 0,
  SHIFT = 1,
  ACTIVATE = 2,
  INACTIVATE = 3,
}

export enum AccessProtocol {
  UNKNOWN = 0,
  HTTP = 1,
  HTTPS = 2,
}

export interface AccessEvent extends Event {
  action: AccessAction;
  protocol: AccessProtocol;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  hash: string;
}
