import http from 'http';
import https from 'https';
import os from 'os';
import { Monitor, MonitorConfig, MonitorReporter } from '@lite-monitor/base';
import {
  AttrArch,
  AttrOrientation,
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

export class NodeMonitor extends Monitor {
  constructor(config: MonitorConfig) {
    super(config, reporter);
    if (!this.user) this.user = os.hostname();
  }

  get core(): number {
    return os.cpus().length;
  }

  get memory(): number {
    const mem = os.totalmem() / (1 << 30);
    if (mem <= 0.25) return 0.25;
    if (mem <= 0.5) return 0.5;
    return Math.ceil(mem);
  }

  get platform(): AttrPlatform {
    return AttrPlatform.NODE;
  }

  get platformVersion(): string {
    return process.version.substr(1);
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

  get orientation(): AttrOrientation {
    return AttrOrientation.UNKNOWN;
  }

  get screenResolution(): [number, number] {
    return [0, 0];
  }

  get windowResolution(): [number, number] {
    return [0, 0];
  }

  get publicAttrs(): PublicAttrs {
    return {
      type: AttrType.UNKNOWN,
      timestamp: new Date().getTime(),
      token: this.token,
      user: this.user,
      core: this.core,
      memory: this.memory,
      platform: this.platform,
      platformVersion: this.platformVersion,
      os: this.os,
      osVersion: this.osVersion,
      arch: this.arch,
      orientation: this.orientation,
      screenResolution: this.screenResolution,
      windowResolution: this.windowResolution,
    };
  }

  reportError(error: unknown): Promise<void> {
    if (!(error instanceof Error)) return Promise.resolve();
    const { name, message, stack } = error;
    const event: ErrorEvent = {
      ...this.publicAttrs,
      type: AttrType.ERROR,
      name,
      message,
      stack: stack?.split('\n    at ').slice(1) || [],
    };
    return this.report([event]);
  }

  wrapErrorCatch = <T extends (...args: never[]) => unknown>(f: T) => (
    ...args: Parameters<T>
  ): ReturnType<T> => {
    try {
      const value = f(...args);
      if (value instanceof Promise) {
        return value.catch((error) => {
          this.reportError(error).finally();
          throw error;
        }) as ReturnType<T>;
      }
      return value as ReturnType<T>;
    } catch (error) {
      this.reportError(error).finally();
      throw error;
    }
  };
}

export {
  Monitor,
  MonitorConfigProtocol,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';

export type { MonitorConfig, MonitorReporter } from '@lite-monitor/base';
