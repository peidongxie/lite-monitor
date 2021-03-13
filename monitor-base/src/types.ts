export type JsonItem =
  | boolean
  | number
  | string
  | null
  | JsonObject
  | JsonArray;

export type JsonObject = { [key: string]: JsonItem };

export type JsonArray = JsonItem[];

export enum AttrType {
  UNKNOWN = 0,
  ERROR = 1,
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

export interface ErrorEvent extends Event {
  name: string;
  message: string;
  stack: string[];
}

export enum ResourceAction {
  UNKNOWN = 0,
  CREATE = 1,
  START = 2,
  USE = 3,
  CHECK = 4,
  STOP = 5,
  DESTROY = 6,
}

export interface ResourceEvent extends Event {
  name: string;
  sequence: {
    action: ResourceAction;
    success: boolean;
    message: string;
  }[];
}
