import type { CompleteEvent, Event } from './event';

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
  url: URL;
  token: string;
  user: string;
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
    method: MonitorReporterMethodValue,
    url: URL,
    type: MonitorReporterContentTypeValue,
    body: string,
  ): Promise<void>;
}

/**
 * Type of the monitor
 */

export class Monitor {
  #config: MonitorConfig;
  #reporter: MonitorReporter;

  constructor(config: Partial<MonitorConfig>, reporter: MonitorReporter) {
    const defaultConfig = {
      url: new URL('http://localhost:3001/events'),
      token: '',
      user: '',
    };
    this.#config = { ...defaultConfig, ...config };
    this.#reporter = reporter;
  }

  getConfig(): MonitorConfig {
    return this.#config;
  }

  getReporter(): MonitorReporter {
    return this.#reporter;
  }

  setConfig(config: Partial<MonitorConfig>) {
    this.#config = { ...this.#config, ...config };
  }

  setReporter(reporter: MonitorReporter) {
    this.#reporter = reporter;
  }

  report(events: Event[]): Promise<void> {
    const { token, user } = this.#config;
    const value = events.map<CompleteEvent>((event) => ({
      timestamp: new Date().getTime(),
      token,
      user,
      ...event,
    }));
    const replacer = (key: string, value: unknown) => {
      return typeof value === 'bigint' ? value.toString() + 'n' : value;
    };
    return this.#reporter(
      MonitorReporterMethod.PUT,
      this.#config.url,
      MonitorReporterContentType.JSON,
      JSON.stringify(value, replacer),
    ).catch((reason) => {
      console.error(reason);
    });
  }
}
