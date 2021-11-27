import { Monitor } from '@lite-monitor/base';
import type { MonitorConfig, MonitorReporter } from '@lite-monitor/base';
import {
  AccessMethod,
  AccessProtocol,
  PublicAttrOrientation,
  PublicAttrOs,
  PublicAttrType,
} from './event';
import type {
  AccessEvent,
  AccessMethodValue,
  AccessProtocolValue,
  ComponentActionValue,
  ComponentEvent,
  ErrorEvent,
  PublicAttrArchValue,
  PublicAttrOrientationValue,
  PublicAttrOsValue,
  PublicAttrPlatformValue,
  PublicAttrs,
} from './event';
import parser from './parser';

const reporter: MonitorReporter = (method, url, type, body) => {
  return new Promise((resolve, reject) => {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      reject(new Error('bad url'));
    } else {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': type },
        body,
        mode: 'cors',
      };
      fetch(url.href, options)
        .then(() => resolve())
        .catch((err) => reject(err));
    }
  });
};

class WebMonitor extends Monitor {
  constructor(config: MonitorConfig) {
    super(config, reporter);
  }

  getCore(): number {
    return navigator?.hardwareConcurrency || 0;
  }

  getMemory(): number {
    return (
      (navigator as Navigator & { deviceMemory?: number })?.deviceMemory || 0
    );
  }

  getPlatform(): PublicAttrPlatformValue {
    return parser(navigator?.userAgent || '').browser;
  }

  getPlatformVersion(): string {
    return parser(navigator?.userAgent || '').version;
  }

  getOs(): PublicAttrOsValue {
    return PublicAttrOs.UNKNOWN;
  }

  getOsVersion(): string {
    return '';
  }

  getArch(): PublicAttrArchValue {
    return PublicAttrOs.UNKNOWN;
  }

  getOrientation(): PublicAttrOrientationValue {
    switch (screen?.orientation?.type) {
      case 'landscape-primary':
        return PublicAttrOrientation.LANDSCAPE_PRIMARY;
      case 'landscape-secondary':
        return PublicAttrOrientation.LANDSCAPE_SECONDARY;
      case 'portrait-primary':
        return PublicAttrOrientation.PORTRAIT_PRIMARY;
      case 'portrait-secondary':
        return PublicAttrOrientation.PORTRAIT_SECONDARY;
      default:
        return PublicAttrOrientation.UNKNOWN;
    }
  }

  getScreenResolution(): [number, number] {
    return [screen?.width || 0, screen?.height || 0];
  }

  getWindowResolution(): [number, number] {
    return [window?.innerWidth || 0, window?.innerHeight || 0];
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

  reportError(error: unknown): Promise<void> {
    const event = this.getError(error);
    if (!event) return Promise.resolve();
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

  getComponentXpath(
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

  getComponent(
    uid: string,
    element: Element,
    action: ComponentActionValue,
    payload = '',
  ): ComponentEvent | null {
    if (typeof uid !== 'string') return null;
    if (!(element instanceof Element)) return null;
    if (typeof action !== 'number') return null;
    if (payload !== undefined && typeof payload !== 'string') return null;
    return {
      ...this.getPublicAttrs(),
      type: PublicAttrType.COMPONENT,
      uid,
      xpath: this.getComponentXpath(element),
      action,
      payload,
    };
  }

  reportComponent(
    uid: string,
    element: Element,
    action: ComponentActionValue,
    payload = '',
  ): Promise<void> {
    const event = this.getComponent(uid, element, action, payload);
    console.log(event);
    if (!event) return Promise.resolve();
    return this.report([event]);
  }

  getAccessProtocol(protocol?: string): AccessProtocolValue {
    switch (protocol?.toLowerCase()) {
      case 'http:':
        return AccessProtocol.HTTP;
      case 'https:':
        return AccessProtocol.HTTPS;
      default:
        return AccessProtocol.UNKNOWN;
    }
  }

  getAccessSearch(search?: string): Record<string, string[]> {
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

  getAccess(
    method: AccessMethodValue,
    href = location.href,
  ): AccessEvent | null {
    if (typeof method !== 'number') return null;
    if (typeof href !== 'string') return null;
    try {
      const url = new URL(href);
      return {
        ...this.getPublicAttrs(),
        type: PublicAttrType.ACCESS,
        method,
        protocol: this.getAccessProtocol(url.protocol),
        host: url.hostname,
        port: Number(url.port),
        path: url.pathname,
        search: this.getAccessSearch(url.search),
        hash: url.hash,
      };
    } catch {
      return null;
    }
  }

  reportAccess(method: AccessMethodValue, href = location.href): Promise<void> {
    const event = this.getAccess(method, href);
    if (!event) return Promise.resolve();
    return this.report([event]);
  }

  wrapHistoryMethod<Method extends keyof History>(
    method: Method,
  ): History[Method] {
    const origin = history[method];
    return (...args: Parameters<History[Method]>) => {
      const returnValue: ReturnType<History[Method]> = origin.apply(
        history,
        args,
      );
      const event = Object.assign(new Event(method.toLowerCase()), { args });
      window.dispatchEvent(event);
      return returnValue;
    };
  }

  addAccessListener(): void {
    window.history.pushState = this.wrapHistoryMethod<'pushState'>('pushState');
    window.history.replaceState =
      this.wrapHistoryMethod<'replaceState'>('replaceState');
    window.addEventListener<'pageshow'>('pageshow', () => {
      const raw = localStorage.getItem('lite-monitor-pagehide');
      if (raw) this.report(JSON.parse(raw));
      this.reportAccess(AccessMethod.ENTER);
    });
    window.addEventListener<'pagehide'>('pagehide', () => {
      const event = this.getAccess(AccessMethod.LEAVE);
      localStorage.setItem(
        'lite-monitor-pagehide',
        JSON.stringify(event, (key, value) => {
          return typeof value === 'bigint' ? value.toString() + 'n' : value;
        }),
      );
    });
    window.addEventListener<'hashchange'>('hashchange', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    window.addEventListener<'popstate'>('popstate', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    window.addEventListener('pushstate', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    window.addEventListener('replacestate', () => {
      this.reportAccess(AccessMethod.SWITCH);
    });
    document.addEventListener<'visibilitychange'>('visibilitychange', () => {
      const { visibilityState } = document;
      if (visibilityState === 'visible') {
        this.reportAccess(AccessMethod.ACTIVATE);
      }
      if (visibilityState === 'hidden') {
        this.reportAccess(AccessMethod.INACTIVATE);
      }
    });
    window.addEventListener<'focus'>('focus', () => {
      this.reportAccess(AccessMethod.ACTIVATE);
    });
    window.addEventListener<'blur'>('blur', () => {
      this.reportAccess(AccessMethod.INACTIVATE);
    });
  }
}

export {
  Monitor,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';
export type {
  MonitorConfig,
  MonitorReporterContentTypeKey,
  MonitorReporterContentTypeMap,
  MonitorReporterContentTypeValue,
  MonitorReporter,
  MonitorReporterMethodKey,
  MonitorReporterMethodMap,
  MonitorReporterMethodValue,
} from '@lite-monitor/base';
export { WebMonitor };
