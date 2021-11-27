import type { CompleteEvent, Event } from './event';

type MapKey<M> = keyof M;
type MapValue<M> = M[MapKey<M>];

/**
 * Type(s) related to the monitor config
 */

interface MonitorConfig {
  url: URL;
  token: string;
  user: string;
}

/**
 * Type(s) related to the monitor reporter
 */

const MonitorReporterMethod = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
} as const;
type MonitorReporterMethodMap = typeof MonitorReporterMethod;
type MonitorReporterMethodKey = MapKey<MonitorReporterMethodMap>;
type MonitorReporterMethodValue = MapValue<MonitorReporterMethodMap>;

const MonitorReporterContentType = {
  TEXT: 'text/plain',
  JS: 'application/javascript',
  JSON: 'application/json',
  HTML: 'text/html',
  XML: 'text/xml',
} as const;
type MonitorReporterContentTypeMap = typeof MonitorReporterContentType;
type MonitorReporterContentTypeKey = MapKey<MonitorReporterContentTypeMap>;
type MonitorReporterContentTypeValue = MapValue<MonitorReporterContentTypeMap>;

interface MonitorReporter {
  (
    method: MonitorReporterMethodValue,
    url: URL,
    type: MonitorReporterContentTypeValue,
    body: string,
  ): Promise<void>;
}

/**
 * Monitor class
 */

class Monitor {
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

export { Monitor, MonitorReporterContentType, MonitorReporterMethod };
export type {
  MonitorConfig,
  MonitorReporterContentTypeKey,
  MonitorReporterContentTypeMap,
  MonitorReporterContentTypeValue,
  MonitorReporterMethodKey,
  MonitorReporterMethodMap,
  MonitorReporterMethodValue,
  MonitorReporter,
};
