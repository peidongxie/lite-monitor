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
  private __token__ = '';
  private __user__ = '';

  constructor(config: MonitorConfig, reporter: MonitorReporter) {
    this.config = config;
    this.reporter = reporter;
    const { initToken, initUser } = config;
    if (initToken) this.token = initToken;
    if (initUser) this.user = initUser;
  }

  get token(): string {
    return this.__token__;
  }

  set token(token: string) {
    this.__token__ = String(token);
  }

  get user(): string {
    return this.__user__;
  }

  set user(user: string) {
    this.__user__ = String(user);
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
      MonitorReporterMethod.POST,
      MonitorReporterContentType.JSON,
      JSON.stringify(event, (key, value) => {
        return typeof value === 'bigint' ? value.toString() + 'n' : value;
      }),
    ).catch((reason) => {
      console.error(reason);
    });
  }
}
