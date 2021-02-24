import http from 'http';
import https from 'https';
import {
  Monitor as _Monitor,
  MonitorConfig,
  MonitorConfigProtocol,
  MonitorReporter,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';

const reporter: MonitorReporter = (url, method, contentType, body) => {
  if (!url.startsWith('http')) return;
  const nodeModule = url.startsWith('https') ? https : http;
  const options = { method, headers: { 'Content-Type': contentType } };
  const request = nodeModule.request(url, options);
  request.write(body);
  request.end();
};

class Monitor extends _Monitor {
  constructor(config: MonitorConfig) {
    super(config, reporter);
  }
}

export {
  Monitor,
  MonitorConfig,
  MonitorConfigProtocol,
  MonitorReporter,
  MonitorReporterContentType,
  MonitorReporterMethod,
};
