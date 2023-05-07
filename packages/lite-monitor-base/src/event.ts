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
  device: string;
  deviceVersion: string;
  os: string;
  osVersion: string;
  platform: string;
  platformVersion: string;
  arch: string;
  core: number;
  memory: number;
  orientation: PublicAttrOrientationValue;
  screenResolution: [number, number];
  windowResolution: [number, number];
}

interface PublicAttrsOptional {
  timestamp?: number;
  uuid?: string;
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
  HEAD: 2,
  POST: 3,
  PUT: 4,
  DELETE: 5,
  CONNECT: 6,
  OPTIONS: 7,
  TRACE: 8,
  PATCH: 9,
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
  PublicAttrOrientation,
  PublicAttrType,
  ResourceAction,
  type AccessEvent,
  type AccessMethodKey,
  type AccessMethodMap,
  type AccessMethodValue,
  type AccessProtocolKey,
  type AccessProtocolMap,
  type AccessProtocolValue,
  type CompleteEvent,
  type ComponentActionKey,
  type ComponentActionMap,
  type ComponentActionValue,
  type ComponentEvent,
  type ErrorEvent,
  type Event,
  type MessageEvent,
  type MessageMethodKey,
  type MessageMethodMap,
  type MessageMethodValue,
  type MessageProtocolKey,
  type MessageProtocolMap,
  type MessageProtocolValue,
  type PrivateAttrs,
  type PublicAttrs,
  type PublicAttrOrientationKey,
  type PublicAttrOrientationMap,
  type PublicAttrOrientationValue,
  type PublicAttrTypeKey,
  type PublicAttrTypeMap,
  type PublicAttrTypeValue,
  type PublicAttrsOptional,
  type PublicAttrsRequired,
  type ResourceActionKey,
  type ResourceActionMap,
  type ResourceActionValue,
  type ResourceEvent,
};
