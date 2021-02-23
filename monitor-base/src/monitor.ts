import { MonitorConfig, MonitorReporter } from './typings';

export default class Monitor {
  config: MonitorConfig;
  reporter: MonitorReporter;
  constructor(config: MonitorConfig, reporter: MonitorReporter) {
    this.config = config;
    this.reporter = reporter;
  }
}
