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
  readonly uuid: string;
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
  private registering?: Promise<boolean>;

  constructor(fetcher: MonitorFetcher, config?: MonitorConfig) {
    this.config = {
      uuid: '',
      token: '',
      user: '',
      url: {
        events: 'http://localhost:3001/events',
        uuid: 'http://localhost:3001/uuid',
      },
    };
    this.fetcher = fetcher;
    this.registering = Promise.resolve(config && this.setConfig(config)).then(
      () => this.register(true),
    );
  }

  getConfig(forced?: boolean): Promise<CompleteMonitorConfig> {
    return forced
      ? Promise.resolve(this.config)
      : Promise.resolve(this.registering).then(() => {
          return this.config;
        });
  }

  getFetcher(): MonitorFetcher {
    return this.fetcher;
  }

  register(forced?: boolean): Promise<boolean> {
    return this.getConfig(forced).then((config) => {
      const {
        url: { uuid: uuidUrl },
      } = config;
      this.registering = this.fetcher(
        MonitorFetcherMethod.POST,
        uuidUrl,
        null,
        '',
      )
        .then((uuid) => {
          if (!/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.test(uuid)) {
            throw new Error(uuid);
          }
          this.config = {
            ...this.config,
            uuid,
          };
          return true;
        })
        .catch((e) => {
          console.error(e);
          return false;
        });
      return this.registering;
    });
  }

  report(events: Event[]): Promise<string> {
    const timestamp = Date.now();
    return this.getConfig()
      .then((config) => {
        const {
          uuid,
          token,
          user,
          url: { events: eventsUrl },
        } = config;
        const value = events.map<CompleteEvent>((event) => ({
          timestamp,
          uuid,
          token,
          user,
          ...event,
        }));
        return this.fetcher(
          MonitorFetcherMethod.POST,
          eventsUrl,
          MonitorFetcherContentType.JSON,
          JSON.stringify(value, this.replacer),
        );
      })
      .catch((e) => {
        console.error(e);
        return '';
      });
  }

  setConfig(newConfig: MonitorConfig): Promise<CompleteMonitorConfig> {
    return this.getConfig().then((config) => {
      const {
        uuid,
        token,
        user,
        url: { events: eventsUrl, uuid: uuidUrl },
      } = config;
      this.config = {
        uuid: uuid,
        token: newConfig.token || token,
        user: newConfig.user || user,
        url: {
          events: newConfig.url?.events || eventsUrl,
          uuid: newConfig.url?.uuid || uuidUrl,
        },
      };
      return this.config;
    });
  }

  setFetcher(newFetcher: MonitorFetcher): MonitorFetcher {
    this.fetcher = newFetcher;
    return this.fetcher;
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
