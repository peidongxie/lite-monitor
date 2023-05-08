import assert from 'assert';
import startup from '../../config.json';

interface ServerConfig {
  port: number;
  address: string;
}

interface LoggerConfig {
  level: string;
  pretty: boolean;
}

interface RouterConfig {
  route: {
    method: string;
    url: string;
  }[];
}

interface QueueConfig {
  timeout: number;
}

interface PersistenceConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
  meta: string;
}

interface ProjectConfig {
  prefix: string;
  name: string;
  meta: string;
  startup: {
    name: string;
    title: string;
    type: string;
    token: string;
  }[];
}

const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.APP_PORT || 3000);
const level = process.env.APP_LEVEL || 'info';
const timeout = Number(process.env.APP_TIMEOUT || 5000);
assert(Number.isInteger(port) && port > 0 && port < 65536, 'Invalid port');
assert(Number.isInteger(timeout) && timeout > 0, 'Invalid timeout');

class Config {
  private static instance: Config;

  public static getInstance(): Config {
    if (!this.instance) this.instance = new Config();
    return this.instance;
  }

  private value: {
    server: ServerConfig;
    logger: LoggerConfig;
    router: RouterConfig;
    queue: QueueConfig;
    persistence: PersistenceConfig;
    project: ProjectConfig;
  };

  private constructor() {
    this.value = {
      server: {
        port,
        address: '::',
      },
      logger: {
        level,
        pretty: !isProd,
      },
      router: {
        route: [
          {
            method: 'GET',
            url: '/events',
          },
          {
            method: 'POST',
            url: '/events',
          },
          {
            method: 'POST',
            url: '/uuid',
          },
        ],
      },
      queue: {
        timeout,
      },
      persistence: {
        username: 'owner',
        password: 'lite-monitor',
        host: isProd ? 'db' : 'localhost',
        port: 27017,
        database: 'lite_monitor',
        meta: 'project_info',
      },
      project: {
        prefix: 'project',
        name: '^[a-z0-9_]{1,24}$',
        meta: 'project_meta',
        startup: startup || [],
      },
    };
  }

  public getLoggerConfig(): LoggerConfig {
    return this.value.logger;
  }

  public getPersistenceConfig(): PersistenceConfig {
    return this.value.persistence;
  }

  public getProjectConfig(): ProjectConfig {
    return this.value.project;
  }

  public getQueueConfig(): QueueConfig {
    return this.value.queue;
  }

  public getRouterConfig(): RouterConfig {
    return this.value.router;
  }

  public getServerConfig(): ServerConfig {
    return this.value.server;
  }
}

export {
  Config as default,
  type LoggerConfig,
  type PersistenceConfig,
  type ProjectConfig,
  type QueueConfig,
  type RouterConfig,
  type ServerConfig,
};
