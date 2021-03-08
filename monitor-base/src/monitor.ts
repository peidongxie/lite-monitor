import { Event } from './types';

export enum MonitorConfigProtocol {
  HTTP = 'http',
  HTTPS = 'https',
}

export interface MonitorConfig {
  protocol: MonitorConfigProtocol;
  host: string;
  port: number;
  initToken?: string;
  initUser?: string;
}

export enum MonitorReporterMethod {
  POST = 'POST',
  PUT = 'PUT',
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
  ): Promise<void>;
}

export class Monitor {
  config: MonitorConfig;
  reporter: MonitorReporter;
  private _token = '';
  private _user = '';

  constructor(config: MonitorConfig, reporter: MonitorReporter) {
    this.config = config;
    this.reporter = reporter;
    const { initToken, initUser } = config;
    if (initToken) this.token = initToken;
    if (initUser) this.user = initUser;
  }

  get token(): string {
    return this._token;
  }

  set token(_token: string) {
    this._token = String(_token);
  }

  get user(): string {
    return this._user;
  }

  set user(_user: string) {
    this._user = String(_user);
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
    ).catch((reason: Error) => {
      console.log(reason);
    });
  }
}
