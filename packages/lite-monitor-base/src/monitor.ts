import { Event } from './event';

type MapKey<M> = keyof M;
type MapValue<M> = M[MapKey<M>];

/**
 * Types related to the monitor config
 */

export const MonitorConfigProtocol = {
  HTTP: 'http',
  HTTPS: 'https',
} as const;
export type MonitorConfigProtocolMap = typeof MonitorConfigProtocol;
export type MonitorConfigProtocolKey = MapKey<MonitorConfigProtocolMap>;
export type MonitorConfigProtocolValue = MapValue<MonitorConfigProtocolMap>;

export interface MonitorConfig {
  protocol: MonitorConfigProtocolValue;
  host: string;
  port: number;
  initToken?: string;
  initUser?: string;
}

/**
 * Types related to the monitor reporter
 */

export const MonitorReporterMethod = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
} as const;
export type MonitorReporterMethodMap = typeof MonitorReporterMethod;
export type MonitorReporterMethodKey = MapKey<MonitorReporterMethodMap>;
export type MonitorReporterMethodValue = MapValue<MonitorReporterMethodMap>;

export const MonitorReporterContentType = {
  TEXT: 'text/plain',
  JS: 'application/javascript',
  JSON: 'application/json',
  HTML: 'text/html',
  XML: 'text/xml',
} as const;
export type MonitorReporterContentTypeMap = typeof MonitorReporterContentType;
export type MonitorReporterContentTypeKey =
  MapKey<MonitorReporterContentTypeMap>;
export type MonitorReporterContentTypeValue =
  MapValue<MonitorReporterContentTypeMap>;

export interface MonitorReporter {
  (
    url: string,
    method: MonitorReporterMethodValue,
    contentType: MonitorReporterContentTypeValue,
    body: string,
  ): Promise<void>;
}

/**
 * Type of the monitor
 */

export class Monitor {
  config: MonitorConfig;
  reporter: MonitorReporter;
  #token = '';
  #user = '';

  constructor(config: MonitorConfig, reporter: MonitorReporter) {
    this.config = config;
    this.reporter = reporter;
    const { initToken, initUser } = config;
    if (initToken) this.token = initToken;
    if (initUser) this.user = initUser;
  }

  get token(): string {
    return this.#token;
  }

  set token(token: string) {
    this.#token = String(token);
  }

  get user(): string {
    return this.#user;
  }

  set user(user: string) {
    this.#user = String(user);
  }

  get url(): string {
    const {
      config: { host, port, protocol },
    } = this;
    return `${protocol}://${host}:${port}/record`;
  }

  report(event: Event[]): Promise<void> {
    return this.reporter(
      this.url,
      MonitorReporterMethod.PUT,
      MonitorReporterContentType.JSON,
      JSON.stringify(event, (key, value) => {
        return typeof value === 'bigint' ? value.toString() + 'n' : value;
      }),
    ).catch((reason) => {
      console.error(reason);
    });
  }
}
