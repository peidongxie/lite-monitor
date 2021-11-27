import { PublicAttrPlatform } from './event';
import type { PublicAttrPlatformValue } from './event';

interface UserAgentInfo {
  ua: string;
  browser: PublicAttrPlatformValue;
  version: string;
}

const info: UserAgentInfo = {
  ua: '',
  browser: PublicAttrPlatform.UNKNOWN,
  version: '',
};

const browserRegsList: {
  browser: PublicAttrPlatformValue;
  regs: RegExp[];
}[] = [
  {
    browser: PublicAttrPlatform.CHROME,
    regs: [
      /chromium\/([\w.-]+)/i,
      /headlesschrome(?:\/([\w.]+)|\s)/i,
      /\swv\).+chrome\/([\w.]+)/i,
      /chrome\/v?([\w.]+)/i,
      /(?:(?:android.+)crmo|crios)\/([\w.]+)/i,
    ],
  },
  {
    browser: PublicAttrPlatform.EDGE,
    regs: [/(?:edge|edgios|edga|edg)\/((\d+)?[\w.]+)/i],
  },
  {
    browser: PublicAttrPlatform.FIREFOX,
    regs: [
      /focus\/([\w.]+)/i,
      /fxios\/([\w.-]+)/i,
      /firefox\/([\w.-]+)$/i,
      /firefox\/([\w.]+)\s[\w\s-]+\/[\w.]+$/i,
    ],
  },
  {
    browser: PublicAttrPlatform.IE,
    regs: [
      /iemobile(?:browser)?[/\s]?([\w.]*)/i,
      /(?:ms|\()ie\s([\w.]+)/i,
      /trident.+rv[:\s]([\w.]{1,9}).+like\sgecko/i,
    ],
  },
  {
    browser: PublicAttrPlatform.OPERA,
    regs: [
      /opera\smini\/([\w.-]+)/i,
      /opera\s[mobiletab]{3,6}.+version\/([\w.-]+)/i,
      /opera.+version\/([\w.]+)/i,
      /opera[/\s]+([\w.]+)/i,
      /opios[/\s]+([\w.]+)/i,
      /\sopr\/([\w.]+)/i,
      /opt\/([\w.]+)/i,
      /coast\/([\w.]+)/i,
    ],
  },
  {
    browser: PublicAttrPlatform.SAFARI,
    regs: [
      /version\/([\w.]+)\s.*mobile\/\w+\ssafari/i,
      /version\/([\w.]+)\s.*(?:mobile\s?safari|safari)/i,
    ],
  },
];

/**
 * UA parser
 */

const parser = (ua: string): UserAgentInfo => {
  if (ua !== info.ua) {
    info.ua = ua;
    info.browser = PublicAttrPlatform.UNKNOWN;
    info.version = '';
    browserRegsList.map(({ browser, regs }) => {
      regs.map((reg) => {
        const result = reg.exec(info.ua);
        if (result) {
          info.browser = browser;
          info.version = result[1];
        }
      });
    });
  }
  return info;
};

export default parser;
