import {
  Monitor,
  type MonitorConfig,
  type MonitorFetcher,
} from '@lite-monitor/base';
import {
  AccessMethod,
  AccessProtocol,
  PublicAttrArch,
  PublicAttrOrientation,
  PublicAttrOs,
  PublicAttrType,
  PublicAttrPlatform,
  type AccessEvent,
  type AccessMethodValue,
  type AccessProtocolValue,
  type ComponentActionValue,
  type ComponentEvent,
  type ErrorEvent,
  type PublicAttrArchValue,
  type PublicAttrOrientationValue,
  type PublicAttrOsValue,
  type PublicAttrPlatformValue,
  type PublicAttrs,
} from './event';

interface NavigatorUAData {
  bands: { band: string; version: string }[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues: (hints: string[]) => Promise<{
    architecture?: string;
    bitness?: string;
    bands: { band: string; version: string }[];
    fullVersionList?: { band: string; version: string }[];
    mobile: boolean;
    model?: string;
    platform: string;
    platformVersion?: string;
    uaFullVersion?: string;
  }>;
  toJSON: () => string;
}

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

  public async getAccess(
    method: AccessMethodValue,
    href = globalThis.location.href,
  ): Promise<AccessEvent | null> {
    if (typeof method !== 'number') return null;
    if (typeof href !== 'string') return null;
    try {
      const url = new URL(href);
      return {
        ...(await this.getPublicAttrs()),
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
      };
    } catch {
      return null;
    }
  }

  public async getComponent(
    uid: string,
    element: Element,
    action: ComponentActionValue,
    payload = '',
  ): Promise<ComponentEvent | null> {
    if (typeof uid !== 'string') return null;
    if (!(element instanceof Element)) return null;
    if (typeof action !== 'number') return null;
    if (payload !== undefined && typeof payload !== 'string') return null;
    return {
      ...(await this.getPublicAttrs()),
      type: PublicAttrType.COMPONENT,
      uid,
      xpath: this.getComponentXpath(element),
      action,
      payload,
    };
  }

  public async getError(error: unknown): Promise<ErrorEvent | null> {
    if (!(error instanceof Error)) return null;
    const { name, message, stack } = error;
    return {
      ...(await this.getPublicAttrs()),
      type: PublicAttrType.ERROR,
      name,
      message,
      stack: stack?.split('\n    at ').slice(1) || [],
    };
  }

  public async getPublicAttrs(): Promise<PublicAttrs> {
    return {
      type: PublicAttrType.UNKNOWN,
      core: this.getCore(),
      memory: this.getMemory(),
      platform: await this.getPlatform(),
      platformVersion: await this.getPlatformVersion(),
      os: await this.getOs(),
      osVersion: await this.getOsVersion(),
      arch: await this.getArch(),
      orientation: this.getOrientation(),
      screenResolution: this.getScreenResolution(),
      windowResolution: this.getWindowResolution(),
    };
  }

  public async reportAccess(
    method: AccessMethodValue,
    href = globalThis.location.href,
  ): Promise<string> {
    const event = await this.getAccess(method, href);
    if (!event) return '';
    return this.report([event]);
  }

  public async reportComponent(
    uid: string,
    element: Element,
    action: ComponentActionValue,
    payload = '',
  ): Promise<string> {
    const event = await this.getComponent(uid, element, action, payload);
    if (!event) return '';
    return this.report([event]);
  }

  public async reportError(error: unknown): Promise<string> {
    const event = await this.getError(error);
    if (!event) return '';
    return this.report([event]);
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

  private async getArch(): Promise<PublicAttrArchValue> {
    try {
      const ua = (
        globalThis.navigator as Navigator & {
          userAgentData: NavigatorUAData;
        }
      ).userAgentData;
      const { architecture, bitness } = await ua.getHighEntropyValues([
        'architecture',
        'bitness',
      ]);
      if (architecture === 'arm' && bitness === '32') {
        return PublicAttrArch.ARM;
      }
      if (architecture === 'arm' && bitness === '64') {
        return PublicAttrArch.ARM64;
      }
      if (architecture === 'x86' && bitness === '32') {
        return PublicAttrArch.X32;
      }
      if (architecture === 'x86' && bitness === '64') {
        return PublicAttrArch.X64;
      }
      return PublicAttrArch.UNKNOWN;
    } catch {
      return PublicAttrArch.UNKNOWN;
    }
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

  private getCore(): number {
    return globalThis.navigator?.hardwareConcurrency || 0;
  }

  private getMemory(): number {
    return (
      (globalThis.navigator as Navigator & { deviceMemory?: number })
        ?.deviceMemory || 0
    );
  }

  private getOrientation(): PublicAttrOrientationValue {
    switch (globalThis.screen?.orientation?.type) {
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

  private async getOs(): Promise<PublicAttrOsValue> {
    return PublicAttrOs.UNKNOWN;
  }

  private async getOsVersion(): Promise<string> {
    return '';
  }

  private async getPlatform(): Promise<PublicAttrPlatformValue> {
    try {
      const ua = (
        globalThis.navigator as Navigator & {
          userAgentData: NavigatorUAData;
        }
      ).userAgentData;
      const { bands, fullVersionList } = await ua.getHighEntropyValues([
        'bands',
        'fullVersionList',
      ]);
      for (const { band } of [...(fullVersionList || []), ...(bands || [])]) {
        if (band === 'Google Chrome') return PublicAttrPlatform.CHROME;
        if (band === 'Microsoft Edge') return PublicAttrPlatform.EDGE;
        if (band === 'Opera') return PublicAttrPlatform.OPERA;
      }
      return PublicAttrPlatform.UNKNOWN;
    } catch {
      return PublicAttrPlatform.UNKNOWN;
    }
  }

  private async getPlatformVersion(): Promise<string> {
    try {
      const ua = (
        globalThis.navigator as Navigator & {
          userAgentData: NavigatorUAData;
        }
      ).userAgentData;
      const { bands, fullVersionList } = await ua.getHighEntropyValues([
        'bands',
        'fullVersionList',
      ]);
      for (const { band, version } of [
        ...(fullVersionList || []),
        ...(bands || []),
      ]) {
        if (band === 'Google Chrome') return version;
        if (band === 'Microsoft Edge') return version;
        if (band === 'Opera') return version;
      }
      return '';
    } catch {
      return '';
    }
  }

  private getScreenResolution(): [number, number] {
    return [globalThis.screen?.width || 0, globalThis.screen?.height || 0];
  }

  private getWindowResolution(): [number, number] {
    return [globalThis?.innerWidth || 0, globalThis?.innerHeight || 0];
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
