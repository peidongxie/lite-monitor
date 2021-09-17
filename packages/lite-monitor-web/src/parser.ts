import { AttrPlatform } from '@lite-monitor/base';

const memory = {
  ua: '',
  browser: [AttrPlatform.UNKNOWN, ''] as [AttrPlatform, string],
};

export const browserTable = [
  [],
  [],
  [
    /chromium\/([\w.-]+)/i,
    /headlesschrome(?:\/([\w.]+)|\s)/i,
    /\swv\).+chrome\/([\w.]+)/i,
    /chrome\/v?([\w.]+)/i,
    /(?:(?:android.+)crmo|crios)\/([\w.]+)/i,
  ],
  [/(?:edge|edgios|edga|edg)\/((\d+)?[\w.]+)/i],
  [
    /focus\/([\w.]+)/i,
    /fxios\/([\w.-]+)/i,
    /firefox\/([\w.-]+)$/i,
    /firefox\/([\w.]+)\s[\w\s-]+\/[\w.]+$/i,
  ],
  [
    /iemobile(?:browser)?[/\s]?([\w.]*)/i,
    /(?:ms|\()ie\s([\w.]+)/i,
    /trident.+rv[:\s]([\w.]{1,9}).+like\sgecko/i,
  ],
  [
    /opera\smini\/([\w.-]+)/i,
    /opera\s[mobiletab]{3,6}.+version\/([\w.-]+)/i,
    /opera.+version\/([\w.]+)/i,
    /opera[/\s]+([\w.]+)/i,
    /opios[/\s]+([\w.]+)/i,
    /\sopr\/([\w.]+)/i,
    /opt\/([\w.]+)/i,
    /coast\/([\w.]+)/i,
  ],
  [
    /version\/([\w.]+)\s.*mobile\/\w+\ssafari/i,
    /version\/([\w.]+)\s.*(?:mobile\s?safari|safari)/i,
  ],
];

export const getBrowser = (ua: string): [AttrPlatform, string] => {
  if (ua !== memory.ua) {
    memory.ua = ua;
    browserTable.map((regs, index) => {
      regs.map((reg) => {
        const result = reg.exec(memory.ua);
        if (result) {
          memory.browser[0] = index;
          memory.browser[1] = result[1];
        }
      });
    });
  }
  return memory.browser;
};
