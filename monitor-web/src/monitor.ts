import { Monitor, MonitorConfig, MonitorReporter } from '@lite-monitor/base';
import {
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

  getXpath(element: Element | null, relativePath: string[] = []): string[] {
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
    return this.getXpath(element.parentElement, [path, ...relativePath]);
  }

  reportComponent(
    uid: string,
    action: ComponentAction,
    element: Element,
    payload = '',
  ): Promise<void> {
    const event: ComponentEvent = {
      ...this.publicAttrs,
      type: AttrType.COMPONENT,
      uid,
      action,
      xpath: this.getXpath(element),
      payload,
    };
    return this.report([event]);
  }

  reportAccess(): Promise<void> {
    return this.report([]);
  }
}

export {
  Monitor,
  MonitorConfigProtocol,
  MonitorReporterContentType,
  MonitorReporterMethod,
} from '@lite-monitor/base';

export type { MonitorConfig, MonitorReporter } from '@lite-monitor/base';
