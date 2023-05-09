import {
  Monitor,
  type MonitorConfig,
  type MonitorFetcher,
} from '@lite-monitor/base';
import {
  UAParser,
  type IBrowser,
  type ICPU,
  type IDevice,
  type IOS,
} from 'ua-parser-js';
import {
  AccessMethod,
  AccessProtocol,
  PublicAttrOrientation,
  PublicAttrType,
  type AccessEvent,
  type AccessMethodValue,
  type AccessProtocolValue,
  type ComponentActionValue,
  type ComponentEvent,
  type ErrorEvent,
  type PublicAttrs,
} from './event';

type IData<T> = T & {
  is(value: string): boolean;
  toString(): string;
  withClientHints(): Promise<IData<T>> | IData<T>;
  withFeatureCheck(): IData<T>;
};

const fetcher: MonitorFetcher = (method, url, type, body) => {
  const protocol = new URL(url).protocol;
  return new Promise((resolve, reject) => {
    if (protocol !== 'http:' && protocol !== 'https:') {
      reject(new Error('bad url'));
    } else {
      const options: RequestInit = {
        method,
        headers: type ? { 'Content-Type': type } : {},
        body,
        mode: 'cors',
      };
      globalThis
        .fetch(url, options)
        .then((res) => resolve(res.statusText))
        .catch((err) => reject(err));
    }
  });
};

/**
 * Web monitor class
 */

class WebMonitor extends Monitor {
  constructor(config?: MonitorConfig) {
    super(fetcher, config);
  }

  public addAccessListener(): void {
    globalThis.history.pushState =
      this.wrapHistoryMethod<'pushState'>('pushState');
    globalThis.history.replaceState =
      this.wrapHistoryMethod<'replaceState'>('replaceState');
    globalThis.addEventListener<'pageshow'>('pageshow', () => {
      const raw = localStorage.getItem('lite-monitor-pagehide');
      if (raw) this.report([JSON.parse(raw)]);
      this.reportAccess(AccessMethod.ENTER);
    });
    globalThis.addEventListener<'pagehide'>('pagehide', () => {
      const event = this.getAccess(AccessMethod.LEAVE);
      localStorage.setItem(
        'lite-monitor-pagehide',
        JSON.stringify(event, (key, value) => {
          return typeof value === 'bigint' ? value.toString() + 'n' : value;
        }),
      );
    });
    globalThis.addEventListener<'hashchange'>('hashchange', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    globalThis.addEventListener<'popstate'>('popstate', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    globalThis.addEventListener('pushstate', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    globalThis.addEventListener('replacestate', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    globalThis.document.addEventListener<'visibilitychange'>(
      'visibilitychange',
      () => {
        const { visibilityState } = globalThis.document;
        if (visibilityState === 'visible') {
          this.reportAccess(AccessMethod.ACTIVATE);
        }
        if (visibilityState === 'hidden') {
          this.reportAccess(AccessMethod.INACTIVATE);
        }
      },
    );
    globalThis.addEventListener<'focus'>('focus', () => {
      this.reportAccess(AccessMethod.ACTIVATE);
    });
    globalThis.addEventListener<'blur'>('blur', () => {
      this.reportAccess(AccessMethod.INACTIVATE);
    });
  }

  public addErrorListener(): void {
    globalThis.addEventListener<'error'>('error', (event) => {
      this.reportError(event.error);
    });
    globalThis.addEventListener<'unhandledrejection'>(
      'unhandledrejection',
      (event) => {
        this.reportError(event.reason);
      },
    );
  }

  public getAccess(
    method: AccessMethodValue,
    href = globalThis.location.href,
  ): Promise<AccessEvent | null> | null {
    if (typeof method !== 'number') return null;
    if (typeof href !== 'string') return null;
    try {
      const url = new URL(href);
      return this.getPublicAttrs()
        .then((attrs) => ({
          ...attrs,
          type: PublicAttrType.ACCESS,
          method,
          protocol: this.getAccessProtocol(url.protocol),
          host: url.hostname,
          port:
            Number(url.port) ||
            (url.protocol === 'https:' ? 443 : 0) ||
            (url.protocol === 'http:' ? 80 : 0),
          path: url.pathname,
          search: this.getAccessSearch(url.search.substring(1)),
          hash: url.hash,
        }))
        .catch((e) => {
          console.error(e);
          return e;
        });
    } catch {
      return null;
    }
  }

  public getComponent(
    uid: string,
    element: Element,
    action: ComponentActionValue,
    payload = '',
  ): Promise<ComponentEvent | null> | null {
    if (typeof uid !== 'string') return null;
    if (!(element instanceof Element)) return null;
    if (typeof action !== 'number') return null;
    if (payload !== undefined && typeof payload !== 'string') return null;
    return this.getPublicAttrs()
      .then((attrs) => ({
        ...attrs,
        type: PublicAttrType.COMPONENT,
        uid,
        xpath: this.getComponentXpath(element),
        action,
        payload,
      }))
      .catch(() => null);
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

  public async getPublicAttrs(): Promise<PublicAttrs> {
    const ua = new UAParser(globalThis.navigator.userAgent);
    const device = await (ua.getDevice() as IData<IDevice>).withClientHints();
    const os = await (ua.getOS() as IData<IOS>).withClientHints();
    const browser = await (
      ua.getBrowser() as IData<IBrowser>
    ).withClientHints();
    const cpu = await (ua.getCPU() as IData<ICPU>).withClientHints();
    return {
      type: PublicAttrType.UNKNOWN,
      device: device.vendor || '',
      deviceVersion: device.model || '',
      os: os.name || '',
      osVersion: os.version || '',
      platform: browser.name || '',
      platformVersion: browser.version || '',
      arch: cpu.architecture || '',
      core: globalThis.navigator?.hardwareConcurrency || 0,
      memory:
        (globalThis.navigator as Navigator & { deviceMemory?: number })
          ?.deviceMemory || 0,
      orientation:
        globalThis.screen?.orientation?.type === 'landscape-primary'
          ? PublicAttrOrientation.LANDSCAPE_PRIMARY
          : globalThis.screen?.orientation?.type === 'landscape-secondary'
          ? PublicAttrOrientation.LANDSCAPE_SECONDARY
          : globalThis.screen?.orientation?.type === 'portrait-primary'
          ? PublicAttrOrientation.PORTRAIT_PRIMARY
          : globalThis.screen?.orientation?.type === 'portrait-secondary'
          ? PublicAttrOrientation.PORTRAIT_SECONDARY
          : PublicAttrOrientation.UNKNOWN,
      screenResolution: [
        globalThis.screen?.width || 0,
        globalThis.screen?.height || 0,
      ],
      windowResolution: [
        globalThis?.innerWidth || 0,
        globalThis?.innerHeight || 0,
      ],
    };
  }

  public async reportAccess(
    method: AccessMethodValue,
    href = globalThis.location.href,
  ): Promise<string> {
    const event = await this.getAccess(method, href);
    return this.report(event ? [event] : []);
  }

  public async reportComponent(
    uid: string,
    element: Element,
    action: ComponentActionValue,
    payload = '',
  ): Promise<string> {
    const event = await this.getComponent(uid, element, action, payload);
    return this.report(event ? [event] : []);
  }

  public async reportError(error: unknown): Promise<string> {
    const event = await this.getError(error);
    return this.report(event ? [event] : []);
  }

  private getAccessProtocol(protocol?: string): AccessProtocolValue {
    switch (protocol?.toLowerCase()) {
      case 'http:':
        return AccessProtocol.HTTP;
      case 'https:':
        return AccessProtocol.HTTPS;
      default:
        return AccessProtocol.UNKNOWN;
    }
  }

  private getAccessSearch(search?: string): Record<string, string[]> {
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

  private getComponentXpath(
    element: Element | null,
    relativePath: string[] = [],
  ): string[] {
    if (!element) return relativePath;
    const { nextElementSibling, previousElementSibling, tagName } = element;
    let sibling: Element | null;
    const count = [0, 0];
    sibling = previousElementSibling;
    while (sibling) {
      if (sibling.tagName === tagName) count[0]++;
      sibling = sibling.previousElementSibling;
    }
    sibling = nextElementSibling;
    while (sibling) {
      if (sibling.tagName === tagName) count[1]++;
      sibling = sibling.nextElementSibling;
    }
    const path =
      count[0] + count[1]
        ? tagName.toLowerCase() + `[${count[0] + 1}]`
        : tagName.toLowerCase();
    return this.getComponentXpath(element.parentElement, [
      path,
      ...relativePath,
    ]);
  }

  private wrapHistoryMethod<Method extends keyof History>(
    method: Method,
  ): History[Method] {
    const origin = globalThis.history[method];
    return (...args: Parameters<History[Method]>) => {
      const returnValue: ReturnType<History[Method]> = origin.apply(
        globalThis.history,
        args,
      );
      const event = Object.assign(new Event(method.toLowerCase()), { args });
      globalThis.dispatchEvent(event);
      return returnValue;
    };
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
export { WebMonitor };
