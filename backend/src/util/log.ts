import { FORMAT, LEVEL } from '../config/log';
import { LogLevel, Loggable } from '../type/log';

const { log } = console;

export const debug = (s: Loggable): void => {
  if (LEVEL <= LogLevel.DEBUG) log(FORMAT('debug', s));
};

export const info = (s: Loggable): void => {
  if (LEVEL <= LogLevel.INFO) log(`\x1b[34m${FORMAT('info', s)}\x1b[0m`);
};

export const warn = (s: Loggable): void => {
  if (LEVEL <= LogLevel.WARN) log(`\x1b[33m${FORMAT('warn', s)}\x1b[0m`);
};

export const error = (s: Loggable): void => {
  if (LEVEL <= LogLevel.ERROR) log(`\x1b[31m${FORMAT('error', s)}\x1b[0m`);
};
