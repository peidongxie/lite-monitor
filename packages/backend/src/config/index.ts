import startupConfig from '../../config.json';

const defaultConfig = {
  server: {
    port: 80,
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
    startup: [],
  },
};

interface ServerConfig {
  port: number;
  level: string;
  pretty: boolean;
}

interface QueueConfig {
  timeout: number;
}

interface PersitenceConfig {
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
  static #instance: Config;
  #value: {
    server: ServerConfig;
    queue: QueueConfig;
    persitence: PersitenceConfig;
    project: ProjectConfig;
  };

  static getInstance(): Config {
    if (!this.#instance) this.#instance = new this(this as never);
    return this.#instance;
  }

  constructor(args: never) {
    args;
    this.#value = {
      server: {
        ...defaultConfig.server,
        ...startupConfig.server,
      },
      queue: {
        ...defaultConfig.queue,
        ...startupConfig.queue,
      },
      persitence: {
        ...defaultConfig.persitence,
        ...startupConfig.persitence,
      },
      project: {
        ...defaultConfig.project,
        ...startupConfig.project,
      },
    };
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
export type { PersitenceConfig, ProjectConfig, QueueConfig, ServerConfig };
