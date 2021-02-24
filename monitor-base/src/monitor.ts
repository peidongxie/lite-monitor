import { Event } from './types';

export enum MonitorConfigProtocol {
  HTTP = 'http',
  HTTPS = 'https',
}

export interface MonitorConfig {
  protocol: MonitorConfigProtocol;
  host: string;
  port: number;
}

export enum MonitorReporterMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
}

export enum MonitorReporterContentType {
  TEXT = 'text/plain',
  JS = 'application/javascript',
  JSON = 'application/json',
  HTML = 'text/html',
  XML = 'text/xml',
}

export interface MonitorReporter {
  (
    url: string,
    method: MonitorReporterMethod,
    contentType: MonitorReporterContentType,
    body: string,
  ): void;
}

export class Monitor {
  config: MonitorConfig;
  reporter: MonitorReporter;

  constructor(config: MonitorConfig, reporter: MonitorReporter) {
    this.config = config;
    this.reporter = reporter;
  }

  get url(): string {
    const {
      config: { host, port, protocol },
    } = this;
    return `${protocol}://${host}:${port}/record`;
  }

  report(event: Event[]): void {
    this.reporter(
      this.url,
      MonitorReporterMethod.POST,
      MonitorReporterContentType.JSON,
      JSON.stringify(event),
    );
  }
}
