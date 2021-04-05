import { Monitor, MonitorConfig, MonitorReporter } from '@lite-monitor/base';
import {
  AccessEvent,
  AccessMethod,
  AccessProtocol,
  AttrArch,
  AttrOrientation,
  AttrOs,
  AttrPlatform,
  AttrType,
  ComponentAction,
  ComponentEvent,
  ErrorEvent,
  PublicAttrs,
} from './types';
import { getBrowser } from './parser';

const reporter: MonitorReporter = (url, method, contentType, body) => {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http')) reject(new Error('bad url'));
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': contentType },
      body,
      mode: 'cors',
    };
    fetch(url, options)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

export class WebMonitor extends Monitor {
  constructor(config: MonitorConfig) {
    super(config, reporter);
  }

  get core(): number {
    return navigator?.hardwareConcurrency || 0;
  }

  get memory(): number {
    return (
      (navigator as Navigator & { deviceMemory?: number })?.deviceMemory || 0
    );
  }

  get platform(): AttrPlatform {
    return getBrowser(navigator?.userAgent || '')[0];
  }

  get platformVersion(): string {
    return getBrowser(navigator?.userAgent || '')[1];
  }

  get os(): AttrOs {
    return AttrOs.UNKNOWN;
  }

  get osVersion(): string {
    return '';
  }

  get arch(): AttrArch {
    return AttrArch.UNKNOWN;
  }

  get orientation(): AttrOrientation {
    switch (screen?.orientation?.type) {
      case 'landscape-primary':
        return AttrOrientation.LANDSCAPE_PRIMARY;
      case 'landscape-secondary':
        return AttrOrientation.LANDSCAPE_SECONDARY;
      case 'portrait-primary':
        return AttrOrientation.PORTRAIT_PRIMARY;
      case 'portrait-secondary':
        return AttrOrientation.PORTRAIT_SECONDARY;
      default:
        return AttrOrientation.UNKNOWN;
    }
  }

  get screenResolution(): [number, number] {
    return [screen?.width || 0, screen?.height || 0];
  }

  get windowResolution(): [number, number] {
    return [window?.innerWidth || 0, window?.innerHeight || 0];
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

  getError(error: Error): ErrorEvent | null {
    if (!(error instanceof Error)) return null;
    const { name, message, stack } = error;
    return {
      ...this.publicAttrs,
      type: AttrType.ERROR,
      name,
      message,
      stack: stack?.split('\n    at ').slice(1) || [],
    };
  }

  reportError(error: Error): Promise<void> {
    const event = this.getError(error);
    if (!event) return Promise.resolve();
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
    action: ComponentAction,
    payload = '',
  ): ComponentEvent | null {
    if (typeof uid !== 'string') return null;
    if (element instanceof Element) return null;
    if (typeof action !== 'number') return null;
    if (payload !== undefined && typeof payload !== 'string') return null;
    return {
      ...this.publicAttrs,
      type: AttrType.COMPONENT,
      uid,
      xpath: this.getComponentXpath(element),
      action,
      payload,
    };
  }

  reportComponent(
    uid: string,
    element: Element,
    action: ComponentAction,
    payload = '',
  ): Promise<void> {
    const event = this.getComponent(uid, element, action, payload);
    if (!event) return Promise.resolve();
    return this.report([event]);
  }

  getAccessProtocol(protocol?: string): AccessProtocol {
    switch (protocol) {
      case 'http':
        return AccessProtocol.HTTP;
      case 'https':
        return AccessProtocol.HTTPS;
      default:
        return AccessProtocol.UNKNOWN;
    }
  }

  getAccessPort(port?: string, protocol?: string): number {
    if (port) return Number(port.substr(1));
    switch (protocol) {
      case 'http':
        return 80;
      case 'https':
        return 443;
      default:
        return 0;
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

  getAccess(method: AccessMethod, href = location.href): AccessEvent | null {
    if (typeof method !== 'number') return null;
    if (typeof href !== 'string') return null;
    const reg = /^(.+):\/\/([^:/?#]+)(?::([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/;
    const result = reg.exec(href);
    if (!result) return null;
    const {
      1: protocol,
      2: host = '',
      3: port = '',
      4: path = '',
      5: search,
      6: hash = '',
    } = result;
    return {
      ...this.publicAttrs,
      type: AttrType.ACCESS,
      method,
      protocol: this.getAccessProtocol(protocol),
      host,
      port: this.getAccessPort(port, protocol),
      path,
      search: this.getAccessSearch(search),
      hash,
    };
  }

  reportAccess(method: AccessMethod, href = location.href): Promise<void> {
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
    window.history.replaceState = this.wrapHistoryMethod<'replaceState'>(
      'replaceState',
    );
    window.addEventListener<'pageshow'>('pageshow', () => {
      const raw = localStorage.getItem('lite-monitor-pagehide');
      if (raw) this.report(JSON.parse(raw));
      this.reportAccess(AccessMethod.ENTER).finally();
    });
    window.addEventListener<'pagehide'>('pagehide', () => {
      const event = this.getAccess(AccessMethod.LEAVE);
      localStorage.setItem('lite-monitor-pagehide', JSON.stringify(event));
    });
    window.addEventListener<'hashchange'>('hashchange', () => {
      this.reportAccess(AccessMethod.SWITCH).finally();
    });
    window.addEventListener<'popstate'>('popstate', () => {
      this.reportAccess(AccessMethod.SWITCH).finally();
    });
    window.addEventListener('pushstate', () => {
      this.reportAccess(AccessMethod.SWITCH).finally();
    });
    window.addEventListener('replacestate', () => {
      this.reportAccess(AccessMethod.SWITCH).finally();
    });
    document.addEventListener<'visibilitychange'>('visibilitychange', () => {
      const { visibilityState } = document;
      if (visibilityState === 'visible') {
        this.reportAccess(AccessMethod.ACTIVATE).finally();
      }
      if (visibilityState === 'hidden') {
        this.reportAccess(AccessMethod.INACTIVATE).finally();
      }
    });
    window.addEventListener<'focus'>('focus', () => {
      this.reportAccess(AccessMethod.ACTIVATE).finally();
    });
    window.addEventListener<'blur'>('blur', () => {
      this.reportAccess(AccessMethod.INACTIVATE).finally();
    });
  }
}

export {
  Monitor,
  MonitorConfigProtocol,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';

export type { MonitorConfig, MonitorReporter } from '@lite-monitor/base';
