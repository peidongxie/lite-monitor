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

interface MonitorConfigItemsReqiured {
  [key: string]: unknown;
}

interface MonitorConfigItemsOptional {
  token?: string;
  user?: string;
  url?: {
    events: string;
    uuid: string;
  };
}

interface MonitorConfig
  extends MonitorConfigItemsReqiured,
    MonitorConfigItemsOptional {}

/**
 * Monitor class
 */

class Monitor {
  private config: Required<MonitorConfig>;
  private fetcher: MonitorFetcher;
  private uuid: Promise<string>;

  constructor(fetcher: MonitorFetcher, config?: MonitorConfig) {
    this.config = {
      token: '',
      user: '',
      url: {
        events: 'http://localhost:3001/events',
        uuid: 'http://localhost:3001/uuid',
      },
    };
    config && this.setConfig(config);
    this.fetcher = fetcher;
    this.uuid = this.register();
  }

  getConfig(): Required<MonitorConfig> {
    return this.config;
  }

  getFetcher(): MonitorFetcher {
    return this.fetcher;
  }

  getUUID(): Promise<string> {
    return this.uuid;
  }

  async report(events: Event[]): Promise<string> {
    const timestamp = new Date().getTime();
    const { token, user } = this.getConfig();
    const fetcher = this.getFetcher();
    const uuid = await this.getUUID();
    const value = events.map<CompleteEvent>((event) => ({
      timestamp,
      token,
      user,
      uuid,
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

  setConfig(config: MonitorConfig) {
    this.config = {
      token: config.token || this.config.token,
      user: config.user || this.config.user,
      url: {
        events: config.url?.events || this.config.url.events,
        uuid: config.url?.uuid || this.config.url.uuid,
      },
    };
  }

  setFetcher(fetcher: MonitorFetcher) {
    this.fetcher = fetcher;
  }

  private async register(): Promise<string> {
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

  private replacer(key: string, value: unknown): unknown {
    return typeof value === 'bigint' ? value.toString() + 'n' : value;
  }
}

export {
  Monitor,
  MonitorFetcherContentType,
  MonitorFetcherMethod,
  type MonitorConfig,
  type MonitorConfigItemsReqiured,
  type MonitorConfigItemsOptional,
  type MonitorFetcherContentTypeKey,
  type MonitorFetcherContentTypeMap,
  type MonitorFetcherContentTypeValue,
  type MonitorFetcherMethodKey,
  type MonitorFetcherMethodMap,
  type MonitorFetcherMethodValue,
  type MonitorFetcher as MonitorFetcher,
};
