import { logger } from '../app';
import { FORMAT, LEVEL } from '../config/logger';
import { LogLevel, Loggable } from '../type/logger';

const { log } = logger;

export const format = (level: string, ...messages: Loggable[]): Loggable => {
  const s = messages.join(' ');
  return FORMAT.replaceAll('{level}', level).replaceAll('{messages}', s);
};

export const debug = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.DEBUG) {
    log(format('debug', ...messages));
  }
};

export const info = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.INFO) {
    log(`\x1b[34m${format('info', ...messages)}\x1b[0m`);
  }
};

export const warn = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.WARN) {
    log(`\x1b[33m${format('warn', ...messages)}\x1b[0m`);
  }
};

export const error = (...messages: Loggable[]): void => {
  if (LEVEL <= LogLevel.ERROR) {
    log(`\x1b[31m${format('error', ...messages)}\x1b[0m`);
  }
};
