import http, { IncomingMessage } from 'http';
import https from 'https';
import os from 'os';
import { TLSSocket } from 'tls';
import { Monitor, MonitorConfig, MonitorReporter } from '@lite-monitor/base';
import {
  AttrArch,
  AttrOrientation,
  AttrOs,
  AttrPlatform,
  AttrType,
  ErrorEvent,
  MessageEvent,
  MessageMethod,
  MessageProtocol,
  MessageVersion,
  PublicAttrs,
  ResourceSequenceElement,
  ResourceEvent,
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
    } catch (e) {
      this.reportError(e).finally();
      throw e;
    }
  };

  reportResource(
    uid: string,
    sequence: ResourceSequenceElement[],
  ): Promise<void> {
    const { publicAttrs } = this;
    const events: ResourceEvent[] = sequence.map((e) => ({
      ...publicAttrs,
      type: AttrType.RESOURCE,
      uid,
      ...e,
    }));
    return this.report(events);
  }

  getMessageVersion(httpVersion?: string): MessageVersion {
    switch (Number(httpVersion)) {
      case 0.9:
        return MessageVersion.HTTP_0_9;
      case 1:
        return MessageVersion.HTTP_1_0;
      case 1.1:
        return MessageVersion.HTTP_1_1;
      case 2:
        return MessageVersion.HTTP_2;
      case 3:
        return MessageVersion.HTTP_3;
      default:
        return MessageVersion.UNKNOWN;
    }
  }

  getMessageMethod(method?: string): MessageMethod {
    switch (method?.toLowerCase()) {
      case 'get':
        return MessageMethod.GET;
      case 'post':
        return MessageMethod.POST;
      case 'delete':
        return MessageMethod.DELETE;
      case 'put':
        return MessageMethod.PUT;
      case 'connect':
        return MessageMethod.CONNECT;
      case 'head':
        return MessageMethod.HEAD;
      case 'options':
        return MessageMethod.OPTIONS;
      case 'patch':
        return MessageMethod.PATCH;
      case 'trace':
        return MessageMethod.TRACE;
      default:
        return MessageMethod.UNKNOWN;
    }
  }

  getMessageSearch(search?: string): Record<string, string[]> {
    if (!search) return {};
    return search
      .split('&')
      .filter((s) => s)
      .map((s) => s.split('=').map((e) => decodeURIComponent(e)))
      .reduce<Record<string, string[]>>((table, [key, value]) => {
        if (Object.prototype.hasOwnProperty.call(table, key)) {
          return { ...table, [key]: [...table[key], value || ''] };
        }
        return { ...table, [key]: [value || ''] };
      }, {});
  }

  reportMessage(message: unknown, code?: number): Promise<void> {
    if (!(message instanceof IncomingMessage)) return Promise.resolve();
    const {
      headers: { host, referer },
      httpVersion,
      method,
      socket: { encrypted, localAddress, remoteAddress },
      url,
    } = message as IncomingMessage & { socket: TLSSocket };
    const event: MessageEvent = {
      ...this.publicAttrs,
      type: AttrType.MESSAGE,
      method: this.getMessageMethod(method),
      protocol: encrypted ? MessageProtocol.HTTPS : MessageProtocol.HTTP,
      host: host?.split(':')[0] || '',
      port: Number(host?.split(':')[1]) || (encrypted ? 443 : 80),
      path: url?.split('?')[0] || '',
      search: this.getMessageSearch(url?.split('?')[1]),
      version: this.getMessageVersion(httpVersion),
      referrer: referer || '',
      ip: [localAddress, remoteAddress || ''],
      code: code || 0,
    };
    return this.report([event]);
  }
}

export {
  Monitor,
  MonitorConfigProtocol,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';

export type { MonitorConfig, MonitorReporter } from '@lite-monitor/base';
