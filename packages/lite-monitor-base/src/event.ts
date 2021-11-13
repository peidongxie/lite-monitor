type MapKey<M> = keyof M;
type MapValue<M> = M[MapKey<M>];

/**
 * Types related to the public attributes
 */

export const PublicAttrType = {
  UNKNOWN: 0,
  ERROR: 1,
  RESOURCE: 2,
  MESSAGE: 3,
  COMPONENT: 4,
  ACCESS: 5,
} as const;
export type PublicAttrTypeMap = typeof PublicAttrType;
export type PublicAttrTypeKey = MapKey<PublicAttrTypeMap>;
export type PublicAttrTypeValue = MapValue<PublicAttrTypeMap>;

export const PublicAttrPlatform = {
  UNKNOWN: 0,
  NODE: 1,
  CHROME: 2,
  EDGE: 3,
  FIREFOX: 4,
  IE: 5,
  OPERA: 6,
  SAFARI: 7,
} as const;
export type PublicAttrPlatformMap = typeof PublicAttrPlatform;
export type PublicAttrPlatformKey = MapKey<PublicAttrPlatformMap>;
export type PublicAttrPlatformValue = MapValue<PublicAttrPlatformMap>;

export const PublicAttrOs = {
  UNKNOWN: 0,
  AIX: 1,
  ANDROID: 2,
  DARWIN: 3,
  FREEBSD: 4,
  LINUX: 5,
  OPENBSD: 6,
  SUNOS: 7,
  WINDOWS: 8,
} as const;
export type PublicAttrOsMap = typeof PublicAttrOs;
export type PublicAttrOsKey = MapKey<PublicAttrOsMap>;
export type PublicAttrOsValue = MapValue<PublicAttrOsMap>;

export const PublicAttrArch = {
  UNKNOWN: 0,
  ARM: 1,
  ARM64: 2,
  IA32: 3,
  MIPS: 4,
  MIPSEL: 5,
  PPC: 6,
  PPC64: 7,
  S390: 8,
  S390X: 9,
  X32: 10,
  X64: 11,
} as const;
export type PublicAttrArchMap = typeof PublicAttrArch;
export type PublicAttrArchKey = MapKey<PublicAttrArchMap>;
export type PublicAttrArchValue = MapValue<PublicAttrArchMap>;

export const PublicAttrOrientation = {
  UNKNOWN: 0,
  LANDSCAPE_PRIMARY: 1,
  LANDSCAPE_SECONDARY: 2,
  PORTRAIT_PRIMARY: 3,
  PORTRAIT_SECONDARY: 4,
} as const;
export type PublicAttrOrientationMap = typeof PublicAttrOrientation;
export type PublicAttrOrientationKey = MapKey<PublicAttrOrientationMap>;
export type PublicAttrOrientationValue = MapValue<PublicAttrOrientationMap>;

export interface PublicAttrs {
  type: PublicAttrTypeValue;
  timestamp: number;
  token: string;
  user: string;
  core: number;
  memory: number;
  platform: PublicAttrPlatformValue;
  platformVersion: string;
  os: PublicAttrOsValue;
  osVersion: string;
  arch: PublicAttrArchValue;
  orientation: PublicAttrOrientationValue;
  screenResolution: [number, number];
  windowResolution: [number, number];
}

/**
 * Types related to the private attributes
 */

export type JsonItem =
  | boolean
  | number
  | string
  | null
  | { [key: string]: JsonItem }
  | JsonItem[];

export type PrivateAttrs = Record<string, JsonItem>;

/**
 * Type of the event
 */

export type Event = PublicAttrs & PrivateAttrs;

/**
 * Type of the error event
 */

export interface ErrorEvent extends Event {
  type: PublicAttrTypeMap['ERROR'];
  name: string;
  message: string;
  stack: string[];
}

/**
 * Types related to the resource event
 */

export const ResourceAction = {
  UNKNOWN: 0,
  CREATE: 1,
  START: 2,
  PRODUCE: 3,
  CONSUME: 4,
  STOP: 5,
  DESTROY: 6,
} as const;
export type ResourceActionMap = typeof ResourceAction;
export type ResourceActionKey = MapKey<ResourceActionMap>;
export type ResourceActionValue = MapValue<ResourceActionMap>;

export interface ResourceEvent extends Event {
  type: PublicAttrTypeMap['RESOURCE'];
  uid: string;
  action: ResourceActionValue;
  payload: string;
}

/**
 * Types related to the message event
 */

export const MessageVersion = {
  UNKNOWN: 0,
  HTTP_0_9: 1,
  HTTP_1_0: 2,
  HTTP_1_1: 3,
  HTTP_2: 4,
  HTTP_3: 5,
} as const;
export type MessageVersionMap = typeof MessageVersion;
export type MessageVersionKey = MapKey<MessageVersionMap>;
export type MessageVersionValue = MapValue<MessageVersionMap>;

export const MessageMethod = {
  UNKNOWN: 0,
  GET: 1,
  POST: 2,
  DELETE: 3,
  PUT: 4,
  CONNECT: 5,
  HEAD: 6,
  OPTIONS: 7,
  PATCH: 8,
  TRACE: 9,
};
export type MessageMethodMap = typeof MessageMethod;
export type MessageMethodKey = MapKey<MessageMethodMap>;
export type MessageMethodValue = MapValue<MessageMethodMap>;

export const MessageProtocol = {
  UNKNOWN: 0,
  HTTP: 1,
  HTTPS: 2,
};
export type MessageProtocolMap = typeof MessageProtocol;
export type MessageProtocolKey = MapKey<MessageProtocolMap>;
export type MessageProtocolValue = MapValue<MessageProtocolMap>;

export interface MessageEvent extends Event {
  type: PublicAttrTypeMap['MESSAGE'];
  method: MessageMethodValue;
  protocol: MessageProtocolValue;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  version: MessageVersionValue;
  referrer: string;
  ip: [string, string];
  code: number;
}

/**
 * Types related to the component event
 */

export const ComponentAction = {
  UNKNOWN: 0,
  CHANGE: 1,
  CLICK: 2,
  ENTER: 3,
  OUT: 4,
  DRAG: 5,
  DROP: 6,
  PRESS: 7,
  CUT: 8,
  COPY: 9,
  PASTE: 10,
} as const;
export type ComponentActionMap = typeof ComponentAction;
export type ComponentActionKey = MapKey<ComponentActionMap>;
export type ComponentActionValue = MapValue<ComponentActionMap>;

export interface ComponentEvent extends Event {
  type: PublicAttrTypeMap['COMPONENT'];
  uid: string;
  xpath: string[];
  action: ComponentActionValue;
  payload: string;
}

/**
 * Types related to the access event
 */

export const AccessMethod = {
  UNKNOWN: 0,
  ENTER: 1,
  SWITCH: 2,
  LEAVE: 3,
  ACTIVATE: 4,
  INACTIVATE: 5,
} as const;
export type AccessMethodMap = typeof AccessMethod;
export type AccessMethodKey = MapKey<AccessMethodMap>;
export type AccessMethodValue = MapValue<AccessMethodMap>;

export const AccessProtocol = {
  UNKNOWN: 0,
  HTTP: 1,
  HTTPS: 2,
} as const;
export type AccessProtocolMap = typeof AccessProtocol;
export type AccessProtocolKey = MapKey<AccessProtocolMap>;
export type AccessProtocolValue = MapValue<AccessProtocolMap>;

export interface AccessEvent extends Event {
  type: PublicAttrTypeMap['ACCESS'];
  method: AccessMethodValue;
  protocol: AccessProtocolValue;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  hash: string;
}
