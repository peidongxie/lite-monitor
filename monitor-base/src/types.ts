export interface JsonObject {
  [key: string]:
    | boolean
    | boolean[]
    | number
    | number[]
    | string
    | string[]
    | null
    | null[]
    | JsonObject
    | JsonObject[];
}

export enum AttrType {
  UNKNOWN = 0,
  ERROR = 1,
}

export enum AttrArch {
  UNKNOWN = 0,
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

export interface PublicAttrs {
  type: AttrType;
  timestamp: number;
  token: string;
  user: string;
  core: number;
  arch: AttrArch;
  totalMemory: number;
  freeMemory: number;
  os: AttrOs;
  osVersion: string;
  platform: AttrPlatform;
  platformVersion: string;
}

export interface PrivateAttrs {
  [key: string]:
    | number
    | number[]
    | string
    | string[]
    | JsonObject
    | JsonObject[];
}

export type Event = PublicAttrs & PrivateAttrs;

export interface ErrorEvent extends Event {
  name: string;
  message: string;
  stack: string[];
}
