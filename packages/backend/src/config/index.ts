import startupConfig from '../../config.json';

const defaultConfig = {
  server: {
    port: 80,
  },
  logger: {
    level: 'info',
    pretty: true,
  },
  persitence: {
    username: 'root',
    password: 'lite-monitor',
    host: 'localhost',
    port: 27017,
    database: 'lite_monitor',
    meta: 'project_info',
  },
  queue: {
    timeout: 5000,
  },
  project: {
    prefix: 'project',
    name: '^[a-z0-9_]{1,24}$',
    meta: 'project_meta',
    demo: [],
  },
};

interface ServerConfig {
  port: number;
}

interface LoggerConfig {
  level: string;
  pretty: boolean;
}

interface PersitenceConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
  meta: string;
}

interface QueueConfig {
  timeout: number;
}

interface ProjectConfig {
  prefix: string;
  name: string;
  meta: string;
  demo: {
    name: string;
    title: string;
    type: string;
    token: string;
  }[];
}

class Config {
  #value: {
    server: ServerConfig;
    logger: LoggerConfig;
    persitence: PersitenceConfig;
    queue: QueueConfig;
    project: ProjectConfig;
  };

  constructor() {
    this.#value = {
      server: {
        ...defaultConfig.server,
        ...startupConfig.server,
      },
      logger: {
        ...defaultConfig.logger,
        ...startupConfig.logger,
      },
      persitence: {
        ...defaultConfig.persitence,
        ...startupConfig.persitence,
      },
      queue: {
        ...defaultConfig.queue,
        ...startupConfig.queue,
      },
      project: {
        ...defaultConfig.project,
        ...startupConfig.project,
      },
    };
  }

  getLoggerConfig(): LoggerConfig {
    return this.#value.logger;
  }

  getPersitenceConfig(): PersitenceConfig {
    return this.#value.persitence;
  }

  getProjectConfig(): ProjectConfig {
    return this.#value.project;
  }

  getQueueConfig(): QueueConfig {
    return this.#value.queue;
  }

  getServerConfig(): ServerConfig {
    return this.#value.server;
  }
}

export default Config;
export type {
  LoggerConfig,
  PersitenceConfig,
  ProjectConfig,
  QueueConfig,
  ServerConfig,
};
