import {
  type RawServerBase,
  type RawRequestDefaultExpression,
  type RawReplyDefaultExpression,
  type RouteHandlerMethod,
  type ContextConfigDefault,
} from 'fastify';

interface RouteGenericInterface {
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

export { type RouteGenericInterface, type RouteHandler };
