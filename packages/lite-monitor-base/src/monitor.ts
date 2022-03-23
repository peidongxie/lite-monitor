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
    url: URL,
    type: MonitorFetcherContentTypeValue | null,
    body: string,
  ): Promise<string>;
}

/**
 * Type(s) related to the monitor config
 */

interface MonitorConfig {
  token: string;
  user: string;
  url: Record<'events' | 'time', URL>;
}

/**
 * Monitor class
 */

class Monitor {
  private config: MonitorConfig;
  private fetcher: MonitorFetcher;

  constructor(fetcher: MonitorFetcher, config?: Partial<MonitorConfig>) {
    const defaultConfig = {
      token: '',
      user: '',
      url: {
        events: new URL('http://localhost:3001/events'),
        time: new URL('http://localhost:3001/time'),
      },
    };
    this.config = { ...defaultConfig, ...config };
    this.fetcher = fetcher;
  }

  getConfig(): MonitorConfig {
    return this.config;
  }

  getFetcher(): MonitorFetcher {
    return this.fetcher;
  }

  report(events: Event[]): Promise<string> {
    const { token, user } = this.config;
    const value = events.map<CompleteEvent>((event) => ({
      timestamp: new Date().getTime(),
      token,
      user,
      ...event,
    }));
    return this.fetcher(
      MonitorFetcherMethod.POST,
      this.config.url.events,
      MonitorFetcherContentType.JSON,
      JSON.stringify(value, this.replacer),
    ).catch((e) => {
      console.error(e);
      return e?.message || '';
    });
  }

  setConfig(config: Partial<MonitorConfig>) {
    this.config = { ...this.config, ...config };
  }

  setFetcher(fetcher: MonitorFetcher) {
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
  type MonitorConfig,
  type MonitorFetcherContentTypeKey,
  type MonitorFetcherContentTypeMap,
  type MonitorFetcherContentTypeValue,
  type MonitorFetcherMethodKey,
  type MonitorFetcherMethodMap,
  type MonitorFetcherMethodValue,
  type MonitorFetcher as MonitorFetcher,
};
