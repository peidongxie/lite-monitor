import {
  Event,
  MonitorConfig,
  MonitorReporter,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from './typings';

export default class Monitor {
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
