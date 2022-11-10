import {
  Monitor,
  type MonitorConfig,
  type MonitorFetcher,
} from '@lite-monitor/base';
import http, { IncomingMessage, type IncomingHttpHeaders } from 'http';
import https from 'https';
import os from 'os';
import {
  MessageMethod,
  MessageProtocol,
  PublicAttrArch,
  PublicAttrOrientation,
  PublicAttrOs,
  PublicAttrPlatform,
  PublicAttrType,
  type ErrorEvent,
  type MessageEvent,
  type MessageMethodValue,
  type MessageProtocolValue,
  type PublicAttrArchValue,
  type PublicAttrOrientationValue,
  type PublicAttrOsValue,
  type PublicAttrPlatformValue,
  type PublicAttrs,
  type ResourceActionValue,
  type ResourceEvent,
} from './event';

const fetcher: MonitorFetcher = (method, url, type, body) => {
  const protocol = new URL(url).protocol;
  return new Promise((resolve, reject) => {
    if (protocol !== 'http:' && protocol !== 'https:') {
      reject(new Error('bad url'));
    } else {
      const nodeModule = protocol === 'http:' ? http : https;
      const options = { method, headers: type ? { 'Content-Type': type } : {} };
      const request = nodeModule.request(url, options, (res) =>
        resolve(res.statusMessage || ''),
      );
      request.on('error', (err) => reject(err));
      request.write(body);
      request.end();
    }
  });
};

class NodeMonitor extends Monitor {
  constructor(config?: MonitorConfig) {
    super(fetcher, { user: os.hostname(), ...config });
  }

  getCore(): number {
    return os.cpus().length;
  }

  getMemory(): number {
    const mem = os.totalmem() / (1 << 30);
    if (mem <= 0.25) return 0.25;
    if (mem <= 0.5) return 0.5;
    return Math.ceil(mem);
  }

  getPlatform(): PublicAttrPlatformValue {
    return PublicAttrPlatform.NODE;
  }

  getPlatformVersion(): string {
    return process.version.substr(1);
  }

  getOs(): PublicAttrOsValue {
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

  getOsVersion(): string {
    return os.release();
  }

  getArch(): PublicAttrArchValue {
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

  getOrientation(): PublicAttrOrientationValue {
    return PublicAttrOrientation.UNKNOWN;
  }

  getScreenResolution(): [number, number] {
    return [0, 0];
  }

  getWindowResolution(): [number, number] {
    return [0, 0];
  }

  getPublicAttrs(): PublicAttrs {
    return {
      type: PublicAttrType.UNKNOWN,
      core: this.getCore(),
      memory: this.getMemory(),
      platform: this.getPlatform(),
      platformVersion: this.getPlatformVersion(),
      os: this.getOs(),
      osVersion: this.getOsVersion(),
      arch: this.getArch(),
      orientation: this.getOrientation(),
      screenResolution: this.getScreenResolution(),
      windowResolution: this.getWindowResolution(),
    };
  }

  getError(error: unknown): ErrorEvent | null {
    if (!(error instanceof Error)) return null;
    const { name, message, stack } = error;
    return {
      ...this.getPublicAttrs(),
      type: PublicAttrType.ERROR,
      name,
      message,
      stack: stack?.split('\n    at ').slice(1) || [],
    };
  }

  reportError(error: unknown): Promise<string> {
    const event = this.getError(error);
    if (!event) return Promise.resolve('');
    return this.report([event]);
  }

  wrapErrorCatch = <T extends (...args: never[]) => unknown>(
    callback: T,
  ): T => {
    const target = (...args: Parameters<T>) => {
      try {
        const value = callback(...args);
        if (value instanceof Promise) {
          return value.catch((error) => {
            this.reportError(error);
            throw error;
          });
        }
        return value;
      } catch (e) {
        this.reportError(e);
        throw e;
      }
    };
    return Object.assign(target, callback);
  };

  globalErrorCatch(): void {
    process.addListener('uncaughtException', (error) => {
      globalThis.console.error(error);
      this.reportError(error).then(() => {
        if (process.listenerCount('uncaughtException') === 1) process.exit();
      });
    });
    process.addListener('unhandledRejection', (error) => {
      globalThis.console.error(error);
      this.reportError(error).then(() => {
        if (process.listenerCount('unhandledRejection') === 1) process.exit();
      });
    });
  }

  getResource(
    uid: string,
    sequenceElement: {
      action: ResourceActionValue;
      payload?: string;
    },
  ): ResourceEvent | null {
    if (typeof uid !== 'string') return null;
    if (typeof sequenceElement !== 'object') return null;
    const { action, payload } = sequenceElement;
    if (typeof action !== 'number') return null;
    if (payload !== undefined && typeof payload !== 'string') return null;
    return {
      ...this.getPublicAttrs(),
      type: PublicAttrType.RESOURCE,
      uid,
      action,
      payload: payload || '',
    };
  }

  reportResource(
    uid: string,
    sequence: {
      action: ResourceActionValue;
      payload?: string;
    }[],
  ): Promise<string> {
    if (!Array.isArray(sequence)) return Promise.resolve('');
    const events = sequence
      .map((e) => this.getResource(uid, e))
      .filter<ResourceEvent>((e): e is ResourceEvent => !!e);
    return this.report(events);
  }

  getMessageHead(headers: IncomingHttpHeaders, name: string): string {
    const value = headers[name];
    if (!value) return '';
    if (!Array.isArray(value)) return value.split(/\s*,\s*/, 1)[0];
    return value[0].split(/\s*,\s*/, 1)[0];
  }

  getMessageMethod(method?: string): MessageMethodValue {
    switch (method?.toLowerCase()) {
      case 'get':
        return MessageMethod.GET;
      case 'head':
        return MessageMethod.HEAD;
      case 'post':
        return MessageMethod.POST;
      case 'put':
        return MessageMethod.PUT;
      case 'delete':
        return MessageMethod.DELETE;
      case 'connect':
        return MessageMethod.CONNECT;
      case 'options':
        return MessageMethod.OPTIONS;
      case 'trace':
        return MessageMethod.TRACE;
      case 'patch':
        return MessageMethod.PATCH;
      default:
        return MessageMethod.UNKNOWN;
    }
  }

  getMessageProtocol(protocol?: string): MessageProtocolValue {
    switch (protocol?.toLowerCase()) {
      case 'http:':
        return MessageProtocol.HTTP;
      case 'https:':
        return MessageProtocol.HTTPS;
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
      headers,
      httpVersionMajor,
      httpVersionMinor,
      method,
      socket: { localAddress, remoteAddress },
    } = message;
    const encrypted = Reflect.has(message.socket, 'encrypted');
    const http2 = httpVersionMajor >= 2;
    const protocol =
      (encrypted ? 'https' : '') ||
      this.getMessageHead(headers, 'x-forwarded-proto') ||
      'http';
    const host =
      this.getMessageHead(headers, 'x-forwarded-host') ||
      (http2 ? this.getMessageHead(headers, ':authority') : '') ||
      this.getMessageHead(headers, 'host') ||
      'unknown';
    const url = new URL(message.url || '', `${protocol}://${host}`);
    return {
      ...this.getPublicAttrs(),
      type: PublicAttrType.MESSAGE,
      method: this.getMessageMethod(method),
      protocol: this.getMessageProtocol(url.protocol),
      host: url.hostname,
      port:
        Number(url.port) ||
        (url.protocol === 'https:' ? 443 : 0) ||
        (url.protocol === 'http:' ? 80 : 0),
      path: url.pathname,
      search: this.getMessageSearch(url.search.substring(1)),
      version: [httpVersionMajor, httpVersionMinor],
      referrer: headers.referer || '',
      ip: [localAddress || '', remoteAddress || ''],
      code: code,
    };
  }

  reportMessage(message: IncomingMessage, code = 0): Promise<string> {
    const event = this.getMessage(message, code);
    if (!event) return Promise.resolve('');
    return this.report([event]);
  }
}

export {
  Monitor,
  MonitorFetcherContentType,
  MonitorFetcherMethod,
  type CompleteMonitorConfig,
  type MonitorConfig,
  type MonitorConfigItemsReadonly,
  type MonitorConfigItemsWritable,
  type MonitorFetcherContentTypeKey,
  type MonitorFetcherContentTypeMap,
  type MonitorFetcherContentTypeValue,
  type MonitorFetcher,
  type MonitorFetcherMethodKey,
  type MonitorFetcherMethodMap,
  type MonitorFetcherMethodValue,
} from '@lite-monitor/base';
export { NodeMonitor };
