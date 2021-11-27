type MapKey<M> = keyof M;
type MapValue<M> = M[MapKey<M>];

/**
 * Type(s) related to the public attributes
 */

const PublicAttrType = {
  UNKNOWN: 0,
  ERROR: 1,
  RESOURCE: 2,
  MESSAGE: 3,
  COMPONENT: 4,
  ACCESS: 5,
} as const;
type PublicAttrTypeMap = typeof PublicAttrType;
type PublicAttrTypeKey = MapKey<PublicAttrTypeMap>;
type PublicAttrTypeValue = MapValue<PublicAttrTypeMap>;

const PublicAttrPlatform = {
  UNKNOWN: 0,
  NODE: 1,
  CHROME: 2,
  EDGE: 3,
  FIREFOX: 4,
  IE: 5,
  OPERA: 6,
  SAFARI: 7,
} as const;
type PublicAttrPlatformMap = typeof PublicAttrPlatform;
type PublicAttrPlatformKey = MapKey<PublicAttrPlatformMap>;
type PublicAttrPlatformValue = MapValue<PublicAttrPlatformMap>;

const PublicAttrOs = {
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
type PublicAttrOsMap = typeof PublicAttrOs;
type PublicAttrOsKey = MapKey<PublicAttrOsMap>;
type PublicAttrOsValue = MapValue<PublicAttrOsMap>;

const PublicAttrArch = {
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
type PublicAttrArchMap = typeof PublicAttrArch;
type PublicAttrArchKey = MapKey<PublicAttrArchMap>;
type PublicAttrArchValue = MapValue<PublicAttrArchMap>;

const PublicAttrOrientation = {
  UNKNOWN: 0,
  LANDSCAPE_PRIMARY: 1,
  LANDSCAPE_SECONDARY: 2,
  PORTRAIT_PRIMARY: 3,
  PORTRAIT_SECONDARY: 4,
} as const;
type PublicAttrOrientationMap = typeof PublicAttrOrientation;
type PublicAttrOrientationKey = MapKey<PublicAttrOrientationMap>;
type PublicAttrOrientationValue = MapValue<PublicAttrOrientationMap>;

interface PublicAttrsRequired {
  type: PublicAttrTypeValue;
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

interface PublicAttrsOptional {
  timestamp?: number;
  token?: string;
  user?: string;
}

type PublicAttrs = PublicAttrsRequired & PublicAttrsOptional;

/**
 * Type(s) related to the private attributes
 */

type PrivateAttrs = Record<string, unknown>;

/**
 * Type(s) related to the event
 */

interface Event
  extends PublicAttrsRequired,
    PublicAttrsOptional,
    PrivateAttrs {}
interface CompleteEvent
  extends PublicAttrsRequired,
    Required<PublicAttrsOptional>,
    PrivateAttrs {}

/**
 * Type(s) related to the the error event
 */

interface ErrorEvent extends Event {
  type: PublicAttrTypeMap['ERROR'];
  name: string;
  message: string;
  stack: string[];
}

/**
 * Type(s) related to the resource event
 */

const ResourceAction = {
  UNKNOWN: 0,
  CREATE: 1,
  START: 2,
  PRODUCE: 3,
  CONSUME: 4,
  STOP: 5,
  DESTROY: 6,
} as const;
type ResourceActionMap = typeof ResourceAction;
type ResourceActionKey = MapKey<ResourceActionMap>;
type ResourceActionValue = MapValue<ResourceActionMap>;

interface ResourceEvent extends Event {
  type: PublicAttrTypeMap['RESOURCE'];
  uid: string;
  action: ResourceActionValue;
  payload: string;
}

/**
 * Type(s) related to the message event
 */

const MessageMethod = {
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
} as const;
type MessageMethodMap = typeof MessageMethod;
type MessageMethodKey = MapKey<MessageMethodMap>;
type MessageMethodValue = MapValue<MessageMethodMap>;

const MessageProtocol = {
  UNKNOWN: 0,
  HTTP: 1,
  HTTPS: 2,
} as const;
type MessageProtocolMap = typeof MessageProtocol;
type MessageProtocolKey = MapKey<MessageProtocolMap>;
type MessageProtocolValue = MapValue<MessageProtocolMap>;

interface MessageEvent extends Event {
  type: PublicAttrTypeMap['MESSAGE'];
  method: MessageMethodValue;
  protocol: MessageProtocolValue;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  version: [number, number];
  referrer: string;
  ip: [string, string];
  code: number;
}

/**
 * Type(s) related to the component event
 */

const ComponentAction = {
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
type ComponentActionMap = typeof ComponentAction;
type ComponentActionKey = MapKey<ComponentActionMap>;
type ComponentActionValue = MapValue<ComponentActionMap>;

interface ComponentEvent extends Event {
  type: PublicAttrTypeMap['COMPONENT'];
  uid: string;
  xpath: string[];
  action: ComponentActionValue;
  payload: string;
}

/**
 * Type(s) related to the access event
 */

const AccessMethod = {
  UNKNOWN: 0,
  ENTER: 1,
  SWITCH: 2,
  LEAVE: 3,
  ACTIVATE: 4,
  INACTIVATE: 5,
} as const;
type AccessMethodMap = typeof AccessMethod;
type AccessMethodKey = MapKey<AccessMethodMap>;
type AccessMethodValue = MapValue<AccessMethodMap>;

const AccessProtocol = {
  UNKNOWN: 0,
  HTTP: 1,
  HTTPS: 2,
} as const;
type AccessProtocolMap = typeof AccessProtocol;
type AccessProtocolKey = MapKey<AccessProtocolMap>;
type AccessProtocolValue = MapValue<AccessProtocolMap>;

interface AccessEvent extends Event {
  type: PublicAttrTypeMap['ACCESS'];
  method: AccessMethodValue;
  protocol: AccessProtocolValue;
  host: string;
  port: number;
  path: string;
  search: Record<string, string[]>;
  hash: string;
}

export {
  AccessMethod,
  AccessProtocol,
  ComponentAction,
  MessageMethod,
  MessageProtocol,
  PublicAttrArch,
  PublicAttrOrientation,
  PublicAttrOs,
  PublicAttrPlatform,
  PublicAttrType,
  ResourceAction,
};
export type {
  AccessEvent,
  AccessMethodKey,
  AccessMethodMap,
  AccessMethodValue,
  AccessProtocolKey,
  AccessProtocolMap,
  AccessProtocolValue,
  CompleteEvent,
  ComponentActionKey,
  ComponentActionMap,
  ComponentActionValue,
  ComponentEvent,
  ErrorEvent,
  Event,
  MessageEvent,
  MessageMethodKey,
  MessageMethodMap,
  MessageMethodValue,
  MessageProtocolKey,
  MessageProtocolMap,
  MessageProtocolValue,
  PrivateAttrs,
  PublicAttrs,
  PublicAttrArchKey,
  PublicAttrArchMap,
  PublicAttrArchValue,
  PublicAttrOrientationKey,
  PublicAttrOrientationMap,
  PublicAttrOrientationValue,
  PublicAttrOsKey,
  PublicAttrOsMap,
  PublicAttrOsValue,
  PublicAttrPlatformKey,
  PublicAttrPlatformMap,
  PublicAttrPlatformValue,
  PublicAttrTypeKey,
  PublicAttrTypeMap,
  PublicAttrTypeValue,
  PublicAttrsOptional,
  PublicAttrsRequired,
  ResourceActionKey,
  ResourceActionMap,
  ResourceActionValue,
  ResourceEvent,
};
