import { type CompleteEvent, type Event } from './event';

type MapKey<M> = keyof M;
type MapValue<M> = M[MapKey<M>];

/**
 * Type(s) related to the monitor fetcher
 */

const MonitorFetcherMethod = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
} as const;
type MonitorFetcherMethodMap = typeof MonitorFetcherMethod;
type MonitorFetcherMethodKey = MapKey<MonitorFetcherMethodMap>;
type MonitorFetcherMethodValue = MapValue<MonitorFetcherMethodMap>;

const MonitorFetcherContentType = {
  TEXT: 'text/plain',
  JS: 'application/javascript',
  JSON: 'application/json',
  HTML: 'text/html',
  XML: 'text/xml',
} as const;
type MonitorFetcherContentTypeMap = typeof MonitorFetcherContentType;
type MonitorFetcherContentTypeKey = MapKey<MonitorFetcherContentTypeMap>;
type MonitorFetcherContentTypeValue = MapValue<MonitorFetcherContentTypeMap>;

interface MonitorFetcher {
  (
    method: MonitorFetcherMethodValue,
    url: string,
    type: MonitorFetcherContentTypeValue | null,
    body: string,
  ): Promise<string>;
}

/**
 * Type(s) related to the monitor config
 */

interface MonitorConfigItemsReadonly {
  readonly uuid: Promise<string>;
}

interface MonitorConfigItemsWritable {
  token: string;
  user: string;
  url: {
    events: string;
    uuid: string;
  };
}

type Never<T> = {
  [P in keyof T]?: never;
};

type RecursiveOptional<T> = {
  [P in keyof T]?: RecursiveOptional<T[P]>;
};

interface MonitorConfig
  extends Never<MonitorConfigItemsReadonly>,
    RecursiveOptional<MonitorConfigItemsWritable> {}

interface CompleteMonitorConfig
  extends MonitorConfigItemsReadonly,
    MonitorConfigItemsWritable {}

/**
 * Monitor class
 */

class Monitor {
  private config: CompleteMonitorConfig;
  private fetcher: MonitorFetcher;

  constructor(fetcher: MonitorFetcher, config?: MonitorConfig) {
    this.config = {
      uuid: Promise.resolve().then(() => this.register()),
      token: '',
      user: '',
      url: {
        events: 'http://localhost:3001/events',
        uuid: 'http://localhost:3001/uuid',
      },
    };
    this.fetcher = fetcher;
    config && this.setConfig(config);
  }

  getConfig(): CompleteMonitorConfig {
    return this.config;
  }

  getFetcher(): MonitorFetcher {
    return this.fetcher;
  }

  async register(): Promise<string> {
    try {
      return this.fetcher(
        MonitorFetcherMethod.POST,
        this.config.url.uuid,
        null,
        '',
      );
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  async report(events: Event[]): Promise<string> {
    const timestamp = new Date().getTime();
    const { uuid: promise, token, user } = this.getConfig();
    const uuid = await promise;
    const fetcher = this.getFetcher();
    const value = events.map<CompleteEvent>((event) => ({
      timestamp,
      uuid,
      token,
      user,
      ...event,
    }));
    try {
      return fetcher(
        MonitorFetcherMethod.POST,
        this.config.url.events,
        MonitorFetcherContentType.JSON,
        JSON.stringify(value, this.replacer),
      );
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  setConfig(config: MonitorConfig): void {
    this.config = {
      uuid: this.config.uuid,
      token: config.token || this.config.token,
      user: config.user || this.config.user,
      url: {
        events: config.url?.events || this.config.url.events,
        uuid: config.url?.uuid || this.config.url.uuid,
      },
    };
  }

  setFetcher(fetcher: MonitorFetcher): void {
    this.fetcher = fetcher;
  }

  private replacer(key: string, value: unknown): unknown {
    return typeof value === 'bigint' ? value.toString() + 'n' : value;
  }
}

export {
  Monitor,
  MonitorFetcherContentType,
  MonitorFetcherMethod,
  type CompleteMonitorConfig,
  type MonitorConfig,
  type MonitorConfigItemsReadonly,
  type MonitorConfigItemsWritable,
  type MonitorFetcherContentTypeKey,
  type MonitorFetcherContentTypeMap,
  type MonitorFetcherContentTypeValue,
  type MonitorFetcherMethodKey,
  type MonitorFetcherMethodMap,
  type MonitorFetcherMethodValue,
  type MonitorFetcher,
};
