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
    let subling: Element | null = null;
    const count = [0, 0];
    subling = previousElementSibling;
    while (subling) {
      if (subling.tagName === tagName) count[0]++;
      subling = subling.previousElementSibling;
    }
    subling = nextElementSibling;
    while (subling) {
      if (subling.tagName === tagName) count[1]++;
      subling = subling.nextElementSibling;
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

  // todo
  getAccess(method: AccessMethod, url: string): AccessEvent | null {
    if (typeof method !== 'number') return null;
    if (typeof url !== 'string') return null;
    return {
      ...this.publicAttrs,
      type: AttrType.ACCESS,
      method,
      protocol: AccessProtocol.UNKNOWN,
      host: '',
      port: 0,
      path: '',
      search: {},
      hash: '',
    };
  }

  reportAccess(method: AccessMethod, url: string): Promise<void> {
    const event = this.getAccess(method, url);
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
      // todo
      this.reportAccess(AccessMethod.ENTER, '');
    });
    window.addEventListener<'pagehide'>('pagehide', () => {
      // todo
      const event = this.getAccess(AccessMethod.LEAVE, '');
      localStorage.setItem('lite-monitor-pagehide', JSON.stringify(event));
    });
    window.addEventListener<'hashchange'>('hashchange', () => {
      // todo
      this.reportAccess(AccessMethod.SWITCH, '');
    });
    window.addEventListener<'popstate'>('popstate', () => {
      // todo
      this.reportAccess(AccessMethod.SWITCH, '');
    });
    window.addEventListener('pushstate', () => {
      // todo
      this.reportAccess(AccessMethod.SWITCH, '');
    });
    window.addEventListener('replacestate', () => {
      // todo
      this.reportAccess(AccessMethod.SWITCH, '');
    });
    document.addEventListener<'visibilitychange'>('visibilitychange', () => {
      // todo
      this.reportAccess(AccessMethod.SWITCH, '');
    });
    window.addEventListener<'focus'>('focus', () => {
      // todo
      this.reportAccess(AccessMethod.ACTIVATE, '');
    });
    window.addEventListener<'blur'>('blur', () => {
      // todo
      this.reportAccess(AccessMethod.INACTIVATE, '');
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
