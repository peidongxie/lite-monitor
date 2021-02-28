import { ErrorRequestHandler } from 'express';
import http from 'http';
import https from 'https';
import { Middleware } from 'koa';
import os from 'os';
import {
  Monitor as _Monitor,
  MonitorConfig,
  MonitorConfigProtocol,
  MonitorReporter,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';
import {
  AttrArch,
  AttrOs,
  AttrPlatform,
  AttrType,
  ErrorEvent,
  PublicAttrs,
} from './types';

const reporter: MonitorReporter = (url, method, contentType, body) => {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http')) reject(new Error('bad url'));
    const nodeModule = url.startsWith('https') ? https : http;
    const options = { method, headers: { 'Content-Type': contentType } };
    const request = nodeModule.request(url, options, () => resolve());
    request.on('error', (err) => reject(err));
    request.write(body);
    request.end();
  });
};

class Monitor extends _Monitor {
  constructor(config: MonitorConfig) {
    super(config, reporter);
    this.user = os.hostname();
  }

  get core(): number {
    return os.cpus().length;
  }

  get arch(): AttrArch {
    switch (os.arch()) {
      case 'arm':
        return AttrArch.ARM;
      case 'arm64':
        return AttrArch.ARM64;
      case 'ia32':
        return AttrArch.IA32;
      case 'mips':
        return AttrArch.MIPS;
      case 'mipsel':
        return AttrArch.MIPSEL;
      case 'ppc':
        return AttrArch.PPC;
      case 'ppc64':
        return AttrArch.PPC64;
      case 's390':
        return AttrArch.S390;
      case 's390x':
        return AttrArch.S390X;
      case 'x32':
        return AttrArch.X32;
      case 'x64':
        return AttrArch.X64;
      default:
        return AttrArch.UNKNOWN;
    }
  }

  get totalMemory(): number {
    const mem = os.totalmem() / (1 << 30);
    if (mem <= 0.25) return 0.25;
    if (mem <= 0.5) return 0.5;
    return Math.ceil(mem);
  }

  get freeMemory(): number {
    const mem = os.freemem() / (1 << 30);
    console.log(os.freemem(), mem, process.memoryUsage());
    return Math.round(mem * 10) / 10;
  }

  get os(): AttrOs {
    switch (os.platform()) {
      case 'aix':
        return AttrOs.AIX;
      case 'android':
        return AttrOs.ANDROID;
      case 'darwin':
        return AttrOs.DARWIN;
      case 'freebsd':
        return AttrOs.FREEBSD;
      case 'linux':
        return AttrOs.LINUX;
      case 'sunos':
        return AttrOs.SUNOS;
      case 'openbsd':
        return AttrOs.OPENBSD;
      case 'win32':
        return AttrOs.WINDOWS;
      default:
        return AttrOs.UNKNOWN;
    }
  }

  get osVersion(): string {
    return os.release();
  }

  get platform(): AttrPlatform {
    return AttrPlatform.NODE;
  }

  get platformVersion(): string {
    return process.version.substr(1);
  }

  get publicAttrs(): PublicAttrs {
    return {
      type: AttrType.UNKNOWN,
      timestamp: new Date().getTime(),
      token: this.token,
      user: this.user,
      core: this.core,
      arch: this.arch,
      totalMemory: this.totalMemory,
      freeMemory: this.freeMemory,
      os: this.os,
      osVersion: this.osVersion,
      platform: this.platform,
      platformVersion: this.platformVersion,
    };
  }

  reportError(error: Error): void {
    const { name, message, stack } = error;
    const event: ErrorEvent = {
      ...this.publicAttrs,
      type: AttrType.ERROR,
      name,
      message,
      stack: stack?.split('\n    at ').slice(1) || [],
    };
    this.report([event]);
  }

  expressMiddleware(): ErrorRequestHandler {
    return (error, res, req, next) => {
      next();
      this.reportError(error);
      throw error;
    };
  }

  koaMiddleware<
    State = Record<string, never>,
    Context = Record<string, never>
  >(): Middleware<State, Context> {
    return async (context, next) => {
      try {
        await next();
      } catch (error) {
        this.reportError(error);
        throw error;
      }
    };
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
