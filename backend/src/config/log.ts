import { LogLevel, Loggable } from '../type/log';

/**
 * 显示的日志级别
 */
export const LEVEL = LogLevel.DEBUG;

/**
 * 打印日志的格式
 * @param level 日志级别
 * @param message 日志详情
 */
export const FORMAT = (level: string, message: Loggable): string => {
  return `[${level}] ${message}`;
};
