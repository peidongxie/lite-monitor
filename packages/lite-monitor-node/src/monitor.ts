import { Monitor } from '@lite-monitor/base';
import type { MonitorConfig, MonitorReporter } from '@lite-monitor/base';
import http, { IncomingMessage } from 'http';
import https from 'https';
import os from 'os';
import { TLSSocket } from 'tls';
import {
  MessageMethod,
  MessageProtocol,
  MessageVersion,
  PublicAttrArch,
  PublicAttrOrientation,
  PublicAttrOs,
  PublicAttrPlatform,
  PublicAttrType,
} from './event';
import type {
  ErrorEvent,
  MessageEvent,
  MessageMethodValue,
  MessageVersionValue,
  PublicAttrArchValue,
  PublicAttrOrientationValue,
  PublicAttrOsValue,
  PublicAttrPlatformValue,
  PublicAttrs,
  ResourceActionValue,
  ResourceEvent,
} from './event';

export interface ResourceSequenceElement {
  action: ResourceActionValue;
  payload?: string;
}

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

  get platform(): PublicAttrPlatformValue {
    return PublicAttrPlatform.NODE;
  }

  get platformVersion(): string {
    return process.version.substr(1);
  }

  get os(): PublicAttrOsValue {
    switch (os.platform()) {
      case 'aix':
        return PublicAttrOs.AIX;
      case 'android':
        return PublicAttrOs.ANDROID;
      case 'darwin':
        return PublicAttrOs.DARWIN;
      case 'freebsd':
        return PublicAttrOs.FREEBSD;
      case 'linux':
        return PublicAttrOs.LINUX;
      case 'sunos':
        return PublicAttrOs.SUNOS;
      case 'openbsd':
        return PublicAttrOs.OPENBSD;
      case 'win32':
        return PublicAttrOs.WINDOWS;
      default:
        return PublicAttrOs.UNKNOWN;
    }
  }

  get osVersion(): string {
    return os.release();
  }

  get arch(): PublicAttrArchValue {
    switch (os.arch()) {
      case 'arm':
        return PublicAttrArch.ARM;
      case 'arm64':
        return PublicAttrArch.ARM64;
      case 'ia32':
        return PublicAttrArch.IA32;
      case 'mips':
        return PublicAttrArch.MIPS;
      case 'mipsel':
        return PublicAttrArch.MIPSEL;
      case 'ppc':
        return PublicAttrArch.PPC;
      case 'ppc64':
        return PublicAttrArch.PPC64;
      case 's390':
        return PublicAttrArch.S390;
      case 's390x':
        return PublicAttrArch.S390X;
      case 'x32':
        return PublicAttrArch.X32;
      case 'x64':
        return PublicAttrArch.X64;
      default:
        return PublicAttrArch.UNKNOWN;
    }
  }

  get orientation(): PublicAttrOrientationValue {
    return PublicAttrOrientation.UNKNOWN;
  }

  get screenResolution(): [number, number] {
    return [0, 0];
  }

  get windowResolution(): [number, number] {
    return [0, 0];
  }

  get publicAttrs(): PublicAttrs {
    return {
      type: PublicAttrType.UNKNOWN,
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

  getError(error: unknown): ErrorEvent | null {
    if (!(error instanceof Error)) return null;
    const { name, message, stack } = error;
    return {
      ...this.publicAttrs,
      type: PublicAttrType.ERROR,
      name,
      message,
      stack: stack?.split('\n    at ').slice(1) || [],
    };
  }

  reportError(error: unknown): Promise<void> {
    const event = this.getError(error);
    if (!event) return Promise.resolve();
    return this.report([event]);
  }

  wrapErrorCatch =
    <T extends (...args: never[]) => unknown>(f: T) =>
    (...args: Parameters<T>): ReturnType<T> => {
      try {
        const value = f(...args);
        if (value instanceof Promise) {
          return value.catch((error) => {
            this.reportError(error);
            throw error;
          }) as ReturnType<T>;
        }
        return value as ReturnType<T>;
      } catch (e) {
        this.reportError(e);
        throw e;
      }
    };

  getResource(
    uid: string,
    sequenceElement: ResourceSequenceElement,
  ): ResourceEvent | null {
    if (typeof uid !== 'string') return null;
    if (typeof sequenceElement !== 'object') return null;
    const { action, payload } = sequenceElement;
    if (typeof action !== 'number') return null;
    if (payload !== undefined && typeof payload !== 'string') return null;
    return {
      ...this.publicAttrs,
      type: PublicAttrType.RESOURCE,
      uid,
      action,
      payload: payload || '',
    };
  }

  reportResource(
    uid: string,
    sequence: ResourceSequenceElement[],
  ): Promise<void> {
    if (!Array.isArray(sequence)) return Promise.resolve();
    const events = sequence
      .map((e) => this.getResource(uid, e))
      .filter<ResourceEvent>((e): e is ResourceEvent => !!e);
    return this.report(events);
  }

  getMessageVersion(httpVersion?: string): MessageVersionValue {
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

  getMessageMethod(method?: string): MessageMethodValue {
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

  getMessage(message: IncomingMessage, code = 0): MessageEvent | null {
    if (!(message instanceof IncomingMessage)) return null;
    if (typeof code !== 'number') return null;
    const {
      headers: { host, referer },
      httpVersion,
      method,
      socket: { encrypted, localAddress, remoteAddress },
      url,
    } = message as IncomingMessage & { socket: TLSSocket };
    return {
      ...this.publicAttrs,
      type: PublicAttrType.MESSAGE,
      method: this.getMessageMethod(method),
      protocol: encrypted ? MessageProtocol.HTTPS : MessageProtocol.HTTP,
      host: host?.split(':')[0] || '',
      port: Number(host?.split(':')[1]) || (encrypted ? 443 : 80),
      path: url?.split('?')[0] || '',
      search: this.getMessageSearch(url?.split('?')[1]),
      version: this.getMessageVersion(httpVersion),
      referrer: referer || '',
      ip: [localAddress || '', remoteAddress || ''],
      code: code,
    };
  }

  reportMessage(message: IncomingMessage, code = 0): Promise<void> {
    const event = this.getMessage(message, code);
    if (!event) return Promise.resolve();
    return this.report([event]);
  }
}

export {
  Monitor,
  MonitorConfigProtocol,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';

export type {
  MonitorConfig,
  MonitorConfigProtocolKey,
  MonitorConfigProtocolMap,
  MonitorConfigProtocolValue,
  MonitorReporterContentTypeKey,
  MonitorReporterContentTypeMap,
  MonitorReporterContentTypeValue,
  MonitorReporter,
  MonitorReporterMethodKey,
  MonitorReporterMethodMap,
  MonitorReporterMethodValue,
} from '@lite-monitor/base';
