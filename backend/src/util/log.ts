import { FORMAT, LEVEL } from '../config/log';
import { LogLevel } from '../type/app';

const { log } = console;

export const debug = (s: string): void => {
  if (LEVEL <= LogLevel.DEBUG) log(FORMAT('debug', s));
};

export const info = (s: string): void => {
  if (LEVEL <= LogLevel.INFO) log(`\x1b[34m${FORMAT('info', s)}\x1b[0m`);
};

export const warn = (s: string): void => {
  if (LEVEL <= LogLevel.WARN) log(`\x1b[33m${FORMAT('warn', s)}\x1b[0m`);
};

export const error = (s: string): void => {
  if (LEVEL <= LogLevel.ERROR) log(`\x1b[31m${FORMAT('error', s)}\x1b[0m`);
};
