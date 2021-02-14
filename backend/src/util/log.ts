import { FORMAT, LEVEL } from '../config/log';
import { LogLevel, Loggable } from '../type/log';

const { log } = console;

export const debug = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.DEBUG) {
    log(FORMAT('debug', ...messages));
  }
};

export const info = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.INFO) {
    log(`\x1b[34m${FORMAT('info', ...messages)}\x1b[0m`);
  }
};

export const warn = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.WARN) {
    log(`\x1b[33m${FORMAT('warn', ...messages)}\x1b[0m`);
  }
};

export const error = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.ERROR) {
    log(`\x1b[31m${FORMAT('error', ...messages)}\x1b[0m`);
  }
};
