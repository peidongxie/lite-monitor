import startupConfig from '../../config.json';

const defaultConfig = {
  server: {
    port: 80,
    address: '::',
  },
  logger: {
    level: 'info',
    pretty: true,
  },
  router: {
    route: [],
  },
  queue: {
    timeout: 5000,
  },
  persistence: {
    username: 'owner',
    password: 'lite-monitor',
    host: 'localhost',
    port: 27017,
    database: 'lite_monitor',
    meta: 'project_info',
  },
  project: {
    prefix: 'project',
    name: '^[a-z0-9_]{1,24}$',
    meta: 'project_meta',
    startup: [],
  },
};

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
        ...defaultConfig.server,
        ...startupConfig.server,
      },
      logger: {
        ...defaultConfig.logger,
        ...startupConfig.logger,
      },
      router: {
        ...defaultConfig.router,
        ...startupConfig.router,
      },
      queue: {
        ...defaultConfig.queue,
        ...startupConfig.queue,
      },
      persistence: {
        ...defaultConfig.persistence,
        ...startupConfig.persistence,
      },
      project: {
        ...defaultConfig.project,
        ...startupConfig.project,
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
