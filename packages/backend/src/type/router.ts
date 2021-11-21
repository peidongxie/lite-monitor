import type {
  RawServerBase,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteHandlerMethod,
  ContextConfigDefault,
} from 'fastify';

export interface RouteGenericInterface {
  Body?: unknown;
  Querystring?: unknown;
  Params?: unknown;
  Headers?: unknown;
  Reply?: unknown;
}

type RouteHandler<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> = RouteHandlerMethod<
  RawServerBase,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGeneric,
  ContextConfigDefault
>;

export type { RouteHandler };
