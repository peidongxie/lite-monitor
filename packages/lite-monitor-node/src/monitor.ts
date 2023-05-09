import {
  Monitor,
  type MonitorConfig,
  type MonitorFetcher,
} from '@lite-monitor/base';
import http, { IncomingMessage, type IncomingHttpHeaders } from 'http';
import https from 'https';
import os from 'os';
import si from 'systeminformation';
import {
  MessageMethod,
  MessageProtocol,
  PublicAttrOrientation,
  PublicAttrType,
  type ErrorEvent,
  type MessageEvent,
  type MessageMethodValue,
  type MessageProtocolValue,
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

  public addErrorListener(): void {
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

  public getError(error: unknown): Promise<ErrorEvent | null> | null {
    if (!(error instanceof Error)) return null;
    const { name, message, stack } = error;
    return this.getPublicAttrs()
      .then((attrs) => ({
        ...attrs,
        type: PublicAttrType.ERROR,
        name,
        message,
        stack: stack?.split('\n    at ').slice(1) || [],
      }))
      .catch(() => null);
  }

  public getMessage(
    message: IncomingMessage,
    code = 0,
  ): Promise<MessageEvent | null> | null {
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
    return this.getPublicAttrs()
      .then((attrs) => ({
        ...attrs,
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
        version: [httpVersionMajor, httpVersionMinor] as [number, number],
        referrer: headers.referer || '',
        ip: [localAddress || '', remoteAddress || ''] as [string, string],
        code: code,
      }))
      .catch(() => null);
  }

  public async getPublicAttrs(): Promise<PublicAttrs> {
    const device = await si.system();
    const os = await si.osInfo();
    const cpu = await si.cpu();
    const memory = await si.mem();
    return {
      type: PublicAttrType.UNKNOWN,
      device: device.manufacturer,
      deviceVersion: device.model,
      os: os.distro,
      osVersion: os.release,
      platform: 'node',
      platformVersion: process.version.substring(1),
      arch: os.arch,
      core: cpu.cores,
      memory: Math.ceil(memory.total / (1 << 28)),
      orientation: PublicAttrOrientation.UNKNOWN,
      screenResolution: [0, 0],
      windowResolution: [0, 0],
    };
  }

  public getResource(
    uid: string,
    sequenceElement: {
      action: ResourceActionValue;
      payload?: string;
    },
  ): Promise<ResourceEvent | null> | null {
    if (typeof uid !== 'string') return null;
    if (typeof sequenceElement !== 'object') return null;
    const { action, payload } = sequenceElement;
    if (typeof action !== 'number') return null;
    if (payload !== undefined && typeof payload !== 'string') return null;
    return this.getPublicAttrs()
      .then((attrs) => ({
        ...attrs,
        type: PublicAttrType.RESOURCE,
        uid,
        action,
        payload: payload || '',
      }))
      .catch(() => null);
  }

  public async reportError(error: unknown): Promise<string> {
    const event = await this.getError(error);
    return this.report(event ? [event] : []);
  }

  public async reportMessage(
    message: IncomingMessage,
    code = 0,
  ): Promise<string> {
    const event = await this.getMessage(message, code);
    return this.report(event ? [event] : []);
  }

  public async reportResource(
    uid: string,
    sequence:
      | {
          action: ResourceActionValue;
          payload?: string;
        }
      | {
          action: ResourceActionValue;
          payload?: string;
        }[],
  ): Promise<string> {
    const events = await Promise.all(
      (Array.isArray(sequence) ? sequence : [sequence]).map((e) =>
        this.getResource(uid, e),
      ),
    );
    return this.report(
      events.filter<ResourceEvent>((e): e is ResourceEvent => !!e),
    );
  }

  private getMessageHead(headers: IncomingHttpHeaders, name: string): string {
    const value = headers[name];
    if (!value) return '';
    if (!Array.isArray(value)) return value.split(/\s*,\s*/, 1)[0];
    return value[0].split(/\s*,\s*/, 1)[0];
  }

  private getMessageMethod(method?: string): MessageMethodValue {
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

  private getMessageProtocol(protocol?: string): MessageProtocolValue {
    switch (protocol?.toLowerCase()) {
      case 'http:':
        return MessageProtocol.HTTP;
      case 'https:':
        return MessageProtocol.HTTPS;
      default:
        return MessageMethod.UNKNOWN;
    }
  }

  private getMessageSearch(search?: string): Record<string, string[]> {
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
